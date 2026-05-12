import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export const CartIcon = () => {
  const { items } = useCartStore();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link to="/cart" className="relative p-2 flex items-center justify-center text-foreground hover:bg-gray-100 rounded-full transition-colors">
      <ShoppingCart size={24} />
      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] px-[5px] py-[2px] rounded-full font-bold shadow-sm">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
};
