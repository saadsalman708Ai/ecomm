import React from 'react';
import { formatPrice } from '../../utils/formatPrice';

export const CartItemPrice = ({ price, quantity, alignLeft = false }: { price: number, quantity: number, alignLeft?: boolean }) => {
  return (
    <div className={alignLeft ? "text-left" : "text-right"}>
      <div className="text-base font-bold text-foreground">
        {formatPrice(price * quantity)}
      </div>
      {quantity > 1 && (
        <div className="text-xs text-foreground-muted mt-0.5">
          {formatPrice(price)} each
        </div>
      )}
    </div>
  );
};
