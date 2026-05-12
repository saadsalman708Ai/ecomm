import React from 'react';
import { formatPrice } from '../../utils/formatPrice';

export const DeliveryCharges = ({ charges, perItemCharge, itemCount }: { charges: number, perItemCharge: number, itemCount: number }) => {
  return (
    <div className="flex justify-between items-center py-2 text-foreground-muted">
      <div className="flex flex-col">
        <span className="text-sm">Delivery Charges</span>
        <span className="text-xs text-foreground-muted/70">{formatPrice(perItemCharge)} per item x {itemCount}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{formatPrice(charges)}</span>
    </div>
  );
};
