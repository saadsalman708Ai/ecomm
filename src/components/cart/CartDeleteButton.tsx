import React from 'react';
import { Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const CartDeleteButton = ({ productId }: { productId: string }) => {
  const { removeItem } = useCartStore();

  return (
    <button 
      onClick={() => removeItem(productId)}
      className="p-2 text-foreground-muted hover:text-error hover:bg-red-50 rounded-full transition-colors ml-2"
      title="Remove Item"
    >
      <Trash2 size={20} />
    </button>
  );
};
