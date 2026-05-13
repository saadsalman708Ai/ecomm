import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, limit, where } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { COLLECTIONS } from '../../lib/firebase/collections';
import { Product } from '../../types/product';
import { ProductCard } from '../home/ProductCard';
import { mutate } from 'swr';
import { SkeletonList } from '../shared/SkeletonList';

const similarProductsCache = new Map<string, { products: Product[], timestamp: number }>();

interface Props {
  product: Product;
}

export const SimilarProducts = React.memo(({ product }: Props) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = similarProductsCache.get(product.id);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return cached.products;
    return [];
  });
  
  const [loading, setLoading] = useState(() => {
    if (!product.tags || product.tags.length === 0) return false;
    const cached = similarProductsCache.get(product.id);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return false;
    return true;
  });

  const getFirestoreQuery = () => {
    const colRef = collection(db, COLLECTIONS.PRODUCTS);
    const constraints: any[] = [];

    if (product.tags && product.tags.length > 0) {
      constraints.push(where('tags', 'array-contains-any', product.tags.slice(0, 5)));
    }
    
    // Fetch a generous chunk to sort them on client safely (avoids composite index requirements)
    constraints.push(limit(100));

    return query(colRef, ...constraints);
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchInitial = async () => {
      const cached = similarProductsCache.get(product.id);
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        setProducts(cached.products);
        setLoading(false);
        return;
      }

      if (!product.tags || product.tags.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setProducts([]);
      
      try {
        const q = getFirestoreQuery();
        const snapshot = await getDocs(q);
        
        if (!isMounted) return;
        
        let initialProds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        initialProds = initialProds.filter(p => p.id !== product.id);

        // Sort by sales count desc
        initialProds.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        
        // Take top 14 (about 2 rows on large screens)
        initialProds = initialProds.slice(0, 14);

        initialProds.forEach(p => mutate(`product/${p.id}`, p, false));
        setProducts(initialProds); 
        
        similarProductsCache.set(product.id, {
          products: initialProds,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchInitial();
    
    return () => { isMounted = false; };
  }, [product.id, product.tags]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-100 pt-16">
      <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
      {loading ? (
        <SkeletonList count={6} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
});
