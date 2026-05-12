import React from 'react';
import type { CartItem as CartItemType } from '../../types/cart';
import { useCartStore } from '../../store/cartStore';
import { CartItemImage } from './CartItemImage';
import { CartItemDetails } from './CartItemDetails';
import { CartQuantityControl } from './CartQuantityControl';
import { CartItemPrice } from './CartItemPrice';
import { CartDeleteButton } from './CartDeleteButton';

export const CartItem = React.memo(({ item }: { item: CartItemType }) => {
  const toggleSelection = useCartStore(state => state.toggleSelection);
  const isSelected = item.isSelected ?? true;

  return (
    <div className={`flex p-4 bg-white border ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-border'} rounded-xl shadow-sm gap-4 hover:shadow-md transition-shadow relative items-center`}>
      <div className="shrink-0 flex items-center pr-1">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => toggleSelection(item.productId)}
          className="w-5 h-5 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={item.maxStock === 0}
        />
      </div>
      
      <div className="shrink-0">
        <CartItemImage imageUrl={item.image} />
      </div>
      
      <div className="flex-1 flex flex-col justify-between min-h-[96px]">
        <div className="flex justify-between items-start gap-4">
           <CartItemDetails productId={item.productId} title={item.title} selectedOptions={item.selectedOptions} />
           
           <div className="hidden sm:block">
              <CartItemPrice price={item.salePrice ?? item.price} quantity={item.quantity} />
           </div>
        </div>
        
        <div className="sm:hidden my-2">
           <CartItemPrice price={item.salePrice ?? item.price} quantity={item.quantity} alignLeft />
        </div>

        <div className="flex items-center w-full mt-auto relative">
          <CartQuantityControl productId={item.productId} quantity={item.quantity} maxStock={item.maxStock} />
          <div className="sm:hidden absolute right-0 bottom-0">
             <CartDeleteButton productId={item.productId} />
          </div>
        </div>
      </div>

      <div className="hidden sm:flex border-l border-border pl-2 h-full items-center ml-2">
        <CartDeleteButton productId={item.productId} />
      </div>
    </div>
  );
});
