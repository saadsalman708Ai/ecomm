import React from 'react';

export const SaleTag = ({ salePercent, salePrice }: { salePercent?: number | null; salePrice?: number | null }) => {
  if (!salePercent && !salePrice) return null;
  return (
    <div className="absolute top-2.5 left-2.5 bg-error text-white text-[10px] font-bold py-0.5 px-2 rounded-md z-10 shadow-sm">
      {salePercent ? `${salePercent}% OFF` : 'SALE'}
    </div>
  );
};
