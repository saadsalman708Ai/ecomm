import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, getDocs, limit, where, startAfter, QueryConstraint, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { COLLECTIONS } from '../../../lib/firebase/collections';
import { Product } from '../../../types/product';
import { ProductCard } from '../../../components/home/ProductCard';
import { SkeletonList } from '../../../components/shared/SkeletonList';
import { EmptyState } from '../../../components/shared/EmptyState';
import { SEO } from '../../../components/shared/SEO';
import { useInView } from 'react-intersection-observer';
import { mutate } from 'swr';
import { useLocalSearch } from '../../../hooks/useLocalSearch';

const searchCache = new Map<string, { products: Product[], lastDoc: QueryDocumentSnapshot<DocumentData> | null, hasMore: boolean, timestamp: number }>();

function getTagMatchCount(product: Product, searchTerms: string[]) {
  if (!searchTerms.length || !product.tags) return 0;
  let count = 0;
  for (const tag of product.tags) {
    if (searchTerms.some(term => tag.toLowerCase().includes(term))) {
      count++;
    }
  }
  if (product.title) {
    if (searchTerms.some(term => product.title.toLowerCase().includes(term))) {
      count += 2; // Title matches weigh more
    }
  }
  return count;
}

function processFetchedProducts(allProds: Product[], qParam: string, categoryParam: string, sortParam: string) {
  const searchTerms = qParam.toLowerCase().split(' ').filter(Boolean);

  // 1. Local Filtering for Category (if we had to use text search in Firestore, category is filtered locally)
  if (categoryParam && categoryParam !== 'All Products') {
    allProds = allProds.filter(p => 
      p.tags?.some(tag => tag.toLowerCase() === categoryParam.toLowerCase())
    );
  }

  // Local filtering for search terms (drop ones that don't match anything)
  if (searchTerms.length > 0) {
    allProds = allProds.filter(p => {
       const titleMatch = searchTerms.some(term => p.title.toLowerCase().includes(term));
       const tagMatch = p.tags?.some(tag => searchTerms.some(term => tag.toLowerCase().includes(term)));
       return titleMatch || tagMatch;
    });
  }

  // 2. Local Ranking and Sorting
  allProds.sort((a, b) => {
    // If there's a search term, rank by match count first
    if (searchTerms.length > 0) {
      const aMatches = getTagMatchCount(a, searchTerms);
      const bMatches = getTagMatchCount(b, searchTerms);
      if (aMatches !== bMatches) {
        return bMatches - aMatches; // Higher matches first
      }
    }

    // Default or fallback sorting based on user selection
    if (sortParam === 'Latest') {
      return b.createdAt - a.createdAt;
    } else if (sortParam === 'Oldest') {
      return a.createdAt - b.createdAt;
    } else if (sortParam === 'Most Sold') {
      return b.soldCount - a.soldCount;
    } else if (sortParam === 'Low Price') {
      return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
    } else if (sortParam === 'High Price') {
      return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
    }
    return 0;
  });

  return allProds;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'Latest';

  const { enabled: localSearchEnabled, products: cachedProducts, loading: cachedLoading } = useLocalSearch();

  const [products, setProducts] = useState<Product[]>(() => {
    const cached = searchCache.get(`${qParam}-${categoryParam}`);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return cached.products;
    return [];
  });
  const [pageSize] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 24);
  const [localDisplayedCount, setLocalDisplayedCount] = useState(pageSize);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(() => {
    const cached = searchCache.get(`${qParam}-${categoryParam}`);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return cached.lastDoc;
    return null;
  });
  const [loading, setLoading] = useState(() => {
    const cached = searchCache.get(`${qParam}-${categoryParam}`);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return false;
    return true;
  });
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(() => {
    const cached = searchCache.get(`${qParam}-${categoryParam}`);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return cached.hasMore;
    return true;
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100% 40% 100% 40%',
  });

  const getFirestoreQuery = (lastVisibleDoc?: QueryDocumentSnapshot<DocumentData> | null) => {
    const colRef = collection(db, COLLECTIONS.PRODUCTS);
    const searchTerms = qParam.toLowerCase().split(' ').filter(Boolean);
    const constraints: QueryConstraint[] = [];

    if (searchTerms.length > 0) {
      constraints.push(where('tags', 'array-contains-any', searchTerms.slice(0, 10)));
    } else if (categoryParam && categoryParam !== 'All Products') {
      constraints.push(where('tags', 'array-contains', categoryParam));
    }

    constraints.push(limit(pageSize));

    if (lastVisibleDoc) {
      constraints.push(startAfter(lastVisibleDoc));
    }

    return query(colRef, ...constraints);
  };

  useEffect(() => {
    if (localSearchEnabled) {
      if (!cachedLoading) {
        setProducts(cachedProducts);
        setLoading(false);
        setLocalDisplayedCount(pageSize); // reset on local mode
      } else {
        setLoading(true);
      }
      return;
    }

    let isMounted = true;
    
    const fetchInitial = async () => {
      const cacheKey = `${qParam}-${categoryParam}`;
      const cached = searchCache.get(cacheKey);
      
      // Use cache if it's less than 5 minutes old
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        setProducts(cached.products);
        setLastDoc(cached.lastDoc);
        setHasMore(cached.hasMore);
        setLoading(false);
        return;
      }

      setLoading(true);
      setProducts([]);
      setLastDoc(null);
      setHasMore(true);
      
      try {
        const q = getFirestoreQuery();
        const snapshot = await getDocs(q);
        
        if (!isMounted) return;
        
        let initialProds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        let newHasMore = snapshot.docs.length >= pageSize;
        let newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

        if (!newHasMore) {
          setHasMore(false);
        }
        if (newLastDoc) {
          setLastDoc(newLastDoc);
        }

        initialProds.forEach(p => mutate(`product/${p.id}`, p, false));

        setProducts(initialProds); 
        
        searchCache.set(cacheKey, {
          products: initialProds,
          lastDoc: newLastDoc,
          hasMore: newHasMore,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error("Error fetching initial search results:", error);
        if (isMounted) setHasMore(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchInitial();
    
    return () => { isMounted = false; };
  }, [qParam, categoryParam, localSearchEnabled, cachedLoading, cachedProducts]);

  useEffect(() => {
    if (localSearchEnabled) {
      return;
    }

    let isMounted = true;

    const fetchMore = async () => {
      if (!inView || fetchingMore || loading || !hasMore || !lastDoc) return;

      setFetchingMore(true);
      try {
        const q = getFirestoreQuery(lastDoc);
        const snapshot = await getDocs(q);
        
        if (!isMounted) return;

        let moreProds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        let newHasMore = snapshot.docs.length >= pageSize;
        let newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : lastDoc;

        if (!newHasMore) {
          setHasMore(false);
        }
        if (newLastDoc) {
          setLastDoc(newLastDoc);
        }

        moreProds.forEach(p => mutate(`product/${p.id}`, p, false));

        const newProducts = [...products];
        const existingIds = new Set(newProducts.map(p => p.id));
        const uniqueMore = moreProds.filter(p => !existingIds.has(p.id));
        newProducts.push(...uniqueMore);

        setProducts(newProducts);
        
        searchCache.set(`${qParam}-${categoryParam}`, {
          products: newProducts,
          lastDoc: newLastDoc,
          hasMore: newHasMore,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error("Error fetching more search results:", error);
        if (isMounted) setHasMore(false);
      } finally {
        if (isMounted) setFetchingMore(false);
      }
    };

    fetchMore();

    return () => { isMounted = false; };
  }, [inView, fetchingMore, loading, hasMore, lastDoc, qParam, categoryParam, localSearchEnabled]);


  const handleSort = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  const sorts = ['Most Sold', 'Latest', 'Oldest', 'Low Price', 'High Price'];

  const displayedProducts = useMemo(() => {
    // Create a copy and process it
    const processed = processFetchedProducts([...products], qParam, categoryParam, sortParam);
    if (localSearchEnabled) {
      // Return ALL items immediately, no infinite scrolling/pagination for local search
      return processed;
    }
    return processed;
  }, [products, qParam, categoryParam, sortParam, localSearchEnabled]);

  // Determine if we should show the "loading more" indicator based on mode
  const showMoreIndicator = localSearchEnabled 
    ? false
    : hasMore;

  return (
    <div className="flex flex-col flex-1">
      <SEO 
        title={qParam ? `Search: ${qParam}` : categoryParam ? `Category: ${categoryParam}` : "Shop Products"} 
        description="Search for products, browse categories, and discover top items."
      />
      {/* Sticky Sort Bar */}
      <div className="bg-white border-b border-border shadow-sm sticky top-[60px] md:top-[68px] z-40 overflow-x-auto hide-scrollbar whitespace-nowrap px-4 py-3 flex gap-6">
         {sorts.map(s => (
           <button 
             key={s} 
             onClick={() => handleSort(s)}
             className={`text-sm font-medium transition-colors ${sortParam === s ? 'text-primary' : 'text-foreground-muted hover:text-foreground'}`}
           >
             {s}
           </button>
         ))}
      </div>

      <div className="p-4 md:p-8 flex-1">
        {qParam && <h2 className="text-xl font-semibold mb-6">Results for "{qParam}"</h2>}
        
        {loading ? (
          <SkeletonList count={8} />
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-5">
              {displayedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {/* Invisible element to trigger intersection observer */}
            {showMoreIndicator && (
              <div ref={ref} className="h-20 mt-8 flex items-center justify-center">
                {fetchingMore || (localSearchEnabled && loading) ? <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-primary animate-spin" /> : null}
              </div>
            )}
            {!showMoreIndicator && products.length > 0 && (
              <div className="text-center text-sm text-foreground-muted mt-12 mb-8">
                You've reached the end of the results.
              </div>
            )}
          </>
        ) : (
          <EmptyState title="No products found" description="Try adjusting your search or filters." />
        )}
      </div>
    </div>
  );
}
