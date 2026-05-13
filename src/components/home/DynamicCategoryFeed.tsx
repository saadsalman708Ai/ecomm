import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { COLLECTIONS } from '../../lib/firebase/collections';
import type { Product } from '../../types/product';
import type { DynamicSortBy } from '../../types/homeSection';
import { ProductCard } from './ProductCard';
import { SkeletonList } from '../shared/SkeletonList';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mutate } from 'swr';

interface Props {
  title: string;
  category: string;
  limitCount?: number;
  isSwiper?: boolean;
  hasBackground?: boolean;
  sortBy?: DynamicSortBy;
}

export const DynamicCategoryFeed = React.memo(({ title, category, limitCount, isSwiper, hasBackground, sortBy }: Props) => {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const setupListener = async () => {
      try {
        let q;
        if (category && category.toLowerCase() !== 'all') {
          q = query(
            collection(db, COLLECTIONS.PRODUCTS), 
            where('tags', 'array-contains', category)
          );
        } else {
          q = query(collection(db, COLLECTIONS.PRODUCTS));
        }

        unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, async (snapshot: any) => {
          if (!isMounted) return;
          let data = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Product));

          // Handle fallback if no data found and searching for specific category
          if (data.length === 0 && category && category.toLowerCase() !== 'all') {
             // Fallback isn't perfect for realtime, but doing a one-time fetch for fallback if empty
             const fallbackQ = query(collection(db, COLLECTIONS.PRODUCTS));
             const fallSnap = await getDocs(fallbackQ);
             let fallData = fallSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
             fallData = fallData.filter(p => p.tags?.some(t => t.toLowerCase() === category.toLowerCase()));
             data = fallData;
          }

          data.sort((a, b) => {
            if (sortBy === 'most_sold') {
              return (b.soldCount || 0) - (a.soldCount || 0);
            } else if (sortBy === 'oldest') {
              return (a.createdAt || 0) - (b.createdAt || 0);
            } else if (sortBy === 'price_low_high') {
              const priceA = a.salePrice ? a.salePrice : a.price;
              const priceB = b.salePrice ? b.salePrice : b.price;
              return priceA - priceB;
            } else if (sortBy === 'price_high_low') {
              const priceA = a.salePrice ? a.salePrice : a.price;
              const priceB = b.salePrice ? b.salePrice : b.price;
              return priceB - priceA;
            } else {
              // latest
              return (b.createdAt || 0) - (a.createdAt || 0);
            }
          });

          if (limitCount && limitCount > 0) {
            data = data.slice(0, limitCount);
          }

          data.forEach((p: Product) => mutate(`product/${p.id}`, p, false));
          setProducts(data);
        }, (error) => {
          console.error("Error fetching category feed:", error);
          if (isMounted) setProducts([]);
        });

      } catch (err) {
        console.error("Error setting up category feed:", err);
        if (isMounted) setProducts([]);
      }
    };

    setupListener();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [category, limitCount, sortBy]);

  if (products === undefined) {
    return (
      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-4 px-1">{title}</h2>
        <SkeletonList count={4} />
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className={`mb-10 ${hasBackground ? 'py-8 md:py-10 relative isolate before:content-[\'\'] before:absolute before:inset-y-0 before:w-[200vw] before:left-1/2 before:-translate-x-1/2 before:bg-primary/10 before:-z-10' : ''}`}>
      <div className="flex justify-between items-center mb-4 px-1 gap-2">
        <h2 className="text-xl font-bold text-foreground text-wrap">{title}</h2>
        <Link to={`/search?category=${encodeURIComponent(category)}`} className="text-sm font-semibold text-primary flex items-center hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
          View All <ArrowRight size={16} className="ml-1 shrink-0" />
        </Link>
      </div>
      
      {isSwiper ? (
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1">
          {products.map(p => (
             <div key={p.id} className="w-[160px] sm:w-[165px] md:w-[175px] xl:w-[200px] shrink-0 snap-start">
                <ProductCard product={p} />
             </div>
          ))}
          <Link 
            to={`/search?category=${encodeURIComponent(category)}`}
            className="shrink-0 snap-start w-[120px] md:w-[150px] flex items-center justify-center p-4 bg-white border border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] rounded-2xl hover:shadow-md transition-all text-primary font-semibold group h-auto"
          >
            <span className="flex items-center whitespace-nowrap">
              View All <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
});
