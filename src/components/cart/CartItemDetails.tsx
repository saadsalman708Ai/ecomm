import React from 'react';
import { Link } from 'react-router-dom';

interface CartItemDetailsProps {
  productId: string;
  title: string;
  selectedOptions?: Record<string, string>;
}

export const CartItemDetails = ({ productId, title, selectedOptions }: CartItemDetailsProps) => {
  return (
    <Link to={`/product/${productId}`} className="flex-1 min-w-0 pr-2">
      <h3 className="text-sm font-medium text-foreground line-clamp-2 md:text-base hover:text-primary transition-colors">
        {title}
      </h3>
      {selectedOptions && Object.keys(selectedOptions).length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
          {Object.entries(selectedOptions).map(([key, value]) => (
             <span key={key} className="text-xs text-foreground-muted">
               <span className="font-medium text-foreground/80">{key}:</span> {value}
             </span>
          ))}
        </div>
      )}
    </Link>
  );
};
