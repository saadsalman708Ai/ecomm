import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { COLLECTIONS } from '../../../lib/firebase/collections';
import { Product } from '../../../types/product';
import { ProductMainImage } from '../../../components/product/ProductMainImage';
import { ProductThumbnails } from '../../../components/product/ProductThumbnails';
import { ProductInfo } from '../../../components/product/ProductInfo';
import { SimilarProducts } from '../../../components/product/SimilarProducts';
import { ErrorState } from '../../../components/shared/ErrorState';
import { SEO } from '../../../components/shared/SEO';
import useSWR, { mutate } from 'swr';

const fetchProduct = async (id: string) => {
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = { id: docSnap.id, ...docSnap.data() } as Product;
    return data;
  }
  throw new Error('Product not found.');
};


export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: product, error, isLoading } = useSWR(id ? `product/${id}` : null, () => fetchProduct(id!), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12 flex-1 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="w-full relative pt-[100%] bg-gray-200 rounded-2xl"></div>
            <div className="flex gap-4">
              {[1,2,3].map(i => <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>)}
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-6 pt-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="p-6 w-full max-w-3xl mx-auto"><ErrorState title="Not Found" message={error?.message || 'Product not found'} /></div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12 flex-1">
      <SEO 
        title={product.name} 
        description={product.description?.substring(0, 160)}
        keywords={product.tags?.join(", ")}
      />
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        <div className="w-full md:w-1/2 flex flex-col">
          <ProductMainImage imageUrl={product.images?.[activeImgIndex]} />
          <ProductThumbnails 
             images={product.images} 
             activeIndex={activeImgIndex} 
             onSelect={setActiveImgIndex} 
          />
        </div>
        <div className="w-full md:w-1/2">
           <ProductInfo product={product} />
        </div>
      </div>
      <SimilarProducts product={product} />
    </div>
  );
}