import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, getDocs, limit, where, startAfter, QueryConstraint, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { COLLECTIONS } from '../../lib/firebase/collections';
import { Product } from '../../types/product';
import { ProductCard } from '../home/ProductCard';
import { useInView } from 'react-intersection-observer';
import { mutate } from 'swr';
import { SkeletonList } from '../shared/SkeletonList';

const similarProductsCache = new Map<string, { products: Product[], lastDoc: QueryDocumentSnapshot<DocumentData> | null, hasMore: boolean, timestamp: number }>();

interface Props {
  product: Product;
}

export const SimilarProducts = React.memo(({ product }: Props) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = similarProductsCache.get(product.id);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return cached.products;
    return [];
  });
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(() => {
    const cached = similarProductsCache.get(product.id);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return cached.lastDoc;
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (!product.tags || product.tags.length === 0) return false;
    const cached = similarProductsCache.get(product.id);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return false;
    return true;
  });
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(() => {
    if (!product.tags || product.tags.length === 0) return false;
    const cached = similarProductsCache.get(product.id);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return cached.hasMore;
    return true;
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100% 40% 100% 40%',
  });

  const getFirestoreQuery = (lastVisibleDoc?: QueryDocumentSnapshot<DocumentData> | null) => {
    const colRef = collection(db, COLLECTIONS.PRODUCTS);
    const constraints: QueryConstraint[] = [];

    // Filter by tags of current product
    if (product.tags && product.tags.length > 0) {
      constraints.push(where('tags', 'array-contains-any', product.tags.slice(0, 10)));
    }

    constraints.push(limit(6));

    if (lastVisibleDoc) {
      constraints.push(startAfter(lastVisibleDoc));
    }

    return query(colRef, ...constraints);
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchInitial = async () => {
      const cached = similarProductsCache.get(product.id);
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        setProducts(cached.products);
        setLastDoc(cached.lastDoc);
        setHasMore(cached.hasMore);
        setLoading(false);
        return;
      }

      if (!product.tags || product.tags.length === 0) {
        setLoading(false);
        setHasMore(false);
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
        initialProds = initialProds.filter(p => p.id !== product.id);

        let newHasMore = snapshot.docs.length >= 6;
        let newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

        if (!newHasMore) {
          setHasMore(false);
        }
        if (newLastDoc) {
          setLastDoc(newLastDoc);
        }

        // Prepopulate SWR cache with these products
        initialProds.forEach(p => mutate(`product/${p.id}`, p, false));

        setProducts(initialProds); 
        
        similarProductsCache.set(product.id, {
          products: initialProds,
          lastDoc: newLastDoc,
          hasMore: newHasMore,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error("Error fetching initial similar products:", error);
        if (isMounted) setHasMore(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchInitial();
    
    return () => { isMounted = false; };
  }, [product.id]);

  useEffect(() => {
    let isMounted = true;

    const fetchMore = async () => {
      if (!inView || fetchingMore || loading || !hasMore || !lastDoc) return;

      setFetchingMore(true);
      try {
        const q = getFirestoreQuery(lastDoc);
        const snapshot = await getDocs(q);
        
        if (!isMounted) return;

        let moreProds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        moreProds = moreProds.filter(p => p.id !== product.id);
        
        let newHasMore = snapshot.docs.length >= 6;
        let newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : lastDoc;

        if (!newHasMore) {
          setHasMore(false);
        }
        if (newLastDoc) {
          setLastDoc(newLastDoc);
        }

        // Prepopulate SWR cache with these products
        moreProds.forEach(p => mutate(`product/${p.id}`, p, false));

        const newProducts = [...products];
        const existingIds = new Set(newProducts.map(p => p.id));
        const uniqueMore = moreProds.filter(p => !existingIds.has(p.id));
        newProducts.push(...uniqueMore);

        setProducts(newProducts);
        
        similarProductsCache.set(product.id, {
          products: newProducts,
          lastDoc: newLastDoc,
          hasMore: newHasMore,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error("Error fetching more similar products:", error);
        if (isMounted) setHasMore(false);
      } finally {
        if (isMounted) setFetchingMore(false);
      }
    };

    fetchMore();

    return () => { isMounted = false; };
  }, [inView, fetchingMore, loading, hasMore, lastDoc, product.id]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-100 pt-16">
      <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
      {loading ? (
        <SkeletonList count={6} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {hasMore && (
            <div ref={ref} className="h-20 mt-8 flex items-center justify-center">
              {fetchingMore ? <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-primary animate-spin" /> : null}
            </div>
          )}
        </>
      )}
    </div>
  );
});
