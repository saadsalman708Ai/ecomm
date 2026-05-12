import React from 'react';

export const ProductMainImage = ({ imageUrl }: { imageUrl: string | undefined }) => {
  return (
    <div className="w-full relative pt-[100%] bg-gray-50 rounded-2xl overflow-hidden border border-border shadow-sm mb-4">
      <div className="absolute inset-0 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt="Product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="text-gray-300 tracking-[4px] font-mono font-medium">IMAGE</div>
        )}
      </div>
    </div>
  );
};
