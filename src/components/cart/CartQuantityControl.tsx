import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { Minus, Plus, Trash2 } from 'lucide-react';

export const CartQuantityControl = ({ productId, quantity, maxStock = Infinity }: { productId: string, quantity: number, maxStock?: number }) => {
  const { updateQuantity, removeItem } = useCartStore();

  if (maxStock === 0) {
    return (
      <div className="flex items-center text-sm font-bold text-error bg-error/10 px-3 py-1.5 rounded-lg border border-error/20">
         Out of Stock
      </div>
    );
  }

  return (
    <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden shadow-sm h-8 shrink-0">
      <button 
        onClick={() => quantity === 1 ? removeItem(productId) : updateQuantity(productId, quantity - 1)}
        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-foreground transition-colors"
      >
        {quantity === 1 ? <Trash2 size={14} className="text-error" /> : <Minus size={14} />}
      </button>
      <div className="w-8 h-full flex items-center justify-center text-sm font-semibold text-foreground border-x border-border bg-gray-50">
        {quantity}
      </div>
      <button 
        onClick={() => updateQuantity(productId, quantity + 1)}
        disabled={quantity >= maxStock}
        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-foreground transition-colors disabled:opacity-50"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
