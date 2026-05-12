import React, { useState } from 'react';
import { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';
import { AddToCartButton } from './AddToCartButton';

export const ProductInfo = ({ product }: { product: Product }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    if (product.options && Array.isArray(product.options)) {
      product.options.forEach(opt => {
        if (opt.options.length > 0) {
          defaults[opt.title] = opt.options[0];
        }
      });
    }
    return defaults;
  });

  const handleOptionSelect = (title: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [title]: value }));
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">{product.title}</h1>
      
      <div className="flex flex-wrap-reverse items-baseline gap-x-3 gap-y-2 mb-6">
        <span className="text-3xl font-extrabold text-foreground">
          {formatPrice(product.salePrice ?? product.price)}
        </span>
        {product.salePrice && (
          <span className="text-base text-foreground-muted line-through font-medium">
            {formatPrice(product.price)}
          </span>
        )}
        {product.salePercent && (
           <span className="bg-error/10 text-error px-2 py-0.5 rounded-md text-xs font-bold">
             {product.salePercent}% OFF
           </span>
        )}
      </div>

      {product.options && product.options.length > 0 && (
        <div className="mb-6 flex flex-col gap-4">
          {product.options.map((opt, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold text-foreground mb-2">{opt.title}</h3>
              <div className="flex flex-wrap gap-2">
                {opt.options.map((val, j) => {
                  const isSelected = selectedOptions[opt.title] === val;
                  return (
                    <button
                      key={j}
                      onClick={() => handleOptionSelect(opt.title, val)}
                      className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                        isSelected 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border bg-white text-foreground hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-10 text-foreground-muted whitespace-pre-wrap leading-relaxed flex-1 mt-6">
        {product.description && (
          <>
            <h3 className="text-base font-semibold text-foreground mb-3">Description</h3>
            <div className="text-sm border border-border/80 bg-slate-100 rounded-xl p-4 md:p-5 w-full">
              {product.description}
            </div>
          </>
        )}
      </div>

      <div className="mt-auto">
        <AddToCartButton 
           productId={product.id}
           title={product.title}
           image={product.images?.[0] || ''}
           price={product.price}
           salePrice={product.salePrice}
           stock={product.quantity}
           selectedOptions={selectedOptions}
        />
      </div>
    </div>
  );
};
