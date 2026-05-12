import React from 'react';
import type { OrderItem } from '../../types/order';
import { formatPrice } from '../../utils/formatPrice';

export const OrderItemRow = ({ item }: { item: OrderItem }) => {
  return (
    <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-xl gap-4 border border-border">
      <div className="w-16 h-16 shrink-0 bg-white rounded-lg overflow-hidden border border-border flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="text-[8px] text-gray-300 font-mono">IMG</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground truncate">{item.title}</h4>
        <div className="text-xs text-foreground-muted mt-1">Qty: {item.quantity}</div>
        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(item.selectedOptions).map(([key, value]) => (
               <span key={key} className="text-xs text-foreground-muted">
                 <span className="font-medium text-foreground/80">{key}:</span> {value}
               </span>
            ))}
          </div>
        )}
      </div>
      <div className="text-right shrink-0 pl-2">
        <div className="text-sm font-bold text-foreground">{formatPrice((item.salePrice ?? item.price) * item.quantity)}</div>
      </div>
    </div>
  );
};
