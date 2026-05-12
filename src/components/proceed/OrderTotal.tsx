import React from 'react';
import { formatPrice } from '../../utils/formatPrice';

export const OrderTotal = ({ subtotal, deliveryCharges }: { subtotal: number, deliveryCharges: number }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-4 border-t border-border mt-2">
      <span className="text-base font-bold text-gray-600">Total to Pay</span>
      <span className="text-2xl font-extrabold text-foreground tracking-tight break-all">
        {formatPrice(subtotal + deliveryCharges)}
      </span>
    </div>
  );
};
