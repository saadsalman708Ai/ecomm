import React from 'react';
import { formatPrice } from '../../utils/formatPrice';

export const CartTotal = ({ total }: { total: number }) => {
  return (
    <div className="flex flex-col items-center md:items-end w-full md:w-auto">
      <span className="text-sm font-medium text-foreground-muted">Subtotal Amount</span>
      <span className="text-2xl font-bold text-foreground tracking-tight">
        {formatPrice(total)}
      </span>
    </div>
  );
};
