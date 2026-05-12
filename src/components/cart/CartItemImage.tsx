import React from 'react';

export const CartItemImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-border flex items-center justify-center relative">
      {imageUrl ? (
        <img src={imageUrl} alt="Item" loading="lazy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <span className="text-[8px] text-gray-300 font-mono tracking-widest">IMAGE</span>
      )}
    </div>
  );
};

