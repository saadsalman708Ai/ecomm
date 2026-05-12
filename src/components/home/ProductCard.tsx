import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { SaleTag } from './SaleTag';
import { formatPrice } from '../../utils/formatPrice';
import { LazyImage } from '../shared/LazyImage';

export const ProductCard = React.memo(({ product }: { product: Product }) => {
  return (
    <Link to={`/product/${product.id}`} className="bg-card rounded-lg overflow-hidden border border-border relative flex flex-col h-full hover:shadow-md transition-shadow">
      <SaleTag salePercent={product.salePercent} salePrice={product.salePrice} />
      <div className="w-full relative pt-[100%] bg-gray-100 flex-none overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {product.images?.[0] ? (
            <LazyImage src={product.images[0]} alt={product.title} />
          ) : (
            <div className="text-[10px] text-gray-300 tracking-[2px] font-mono">IMAGE</div>
          )}
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="text-base sm:text-[17px] font-semibold leading-snug mb-1.5 text-wrap text-foreground/90 line-clamp-2">
          {product.title}
        </div>
        <div className="flex flex-wrap-reverse items-baseline gap-x-2 gap-y-1 mt-1">
          <span className="text-base font-bold text-foreground">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <span className="text-xs text-foreground-muted line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

