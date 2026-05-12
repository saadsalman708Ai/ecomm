import React, { useEffect } from 'react';
import { useCartStore } from '../../../store/cartStore';
import { CartItem } from '../../../components/cart/CartItem';
import { CartTotal } from '../../../components/cart/CartTotal';
import { PlaceOrderButton } from '../../../components/cart/PlaceOrderButton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ShoppingBag } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { COLLECTIONS } from '../../../lib/firebase/collections';
import { useAuth } from '../../../hooks/useAuth';

export default function CartPage() {
  const { items, toggleAllSelection } = useCartStore();
  const { user } = useAuth();
  
  const inStockItems = items.filter(i => (i.maxStock ?? 1) > 0);
  const selectedItems = items.filter(i => i.isSelected ?? true);
  const totalAmount = selectedItems.reduce((sum, item) => sum + ((item.salePrice ?? item.price) * item.quantity), 0);
  
  // allSelected should be true if all IN-STOCK items are selected (and there is at least one in-stock item)
  const allSelected = inStockItems.length > 0 && selectedItems.length === inStockItems.length;

  useEffect(() => {
    if (items.length === 0) return;
    
    // Async background validation of cart on load
    const syncStock = async () => {
      try {
        const checks = await Promise.all(items.map(async (item) => {
          const productRef = doc(db, COLLECTIONS.PRODUCTS, item.productId);
          const snap = await getDoc(productRef);
          if (snap.exists()) {
             return { productId: item.productId, maxStock: snap.data().quantity || 0 };
          }
          return { productId: item.productId, maxStock: 0 };
        }));
        
        useCartStore.getState().syncStockOverrides(checks);
      } catch (err) {
        console.error("Failed to sync stock on cart load", err);
      }
    };
    
    syncStock();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">Your Cart</h1>
      
      {items.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="bg-gray-50 border border-border p-4 md:p-6 rounded-2xl shadow-sm flex flex-col items-end gap-4 lg:flex-row lg:justify-between lg:items-center">
            <CartTotal total={totalAmount} />
            <div className="w-full lg:w-auto mt-2 lg:mt-0 flex justify-end">
              <PlaceOrderButton disabled={selectedItems.length === 0} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div 
              onClick={(e) => {
                if ((e.target as HTMLElement).tagName !== 'INPUT') {
                  toggleAllSelection(!allSelected);
                }
              }}
              className={`flex items-center gap-4 p-4 bg-white border ${allSelected ? 'border-primary ring-1 ring-primary' : 'border-border'} rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
            >
              <div className="shrink-0 flex items-center pr-1">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={(e) => toggleAllSelection(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
              </div>
              <span className="text-sm font-semibold text-foreground-muted">Select All Items</span>
            </div>

            {items.map(item => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState 
          title="Your cart is empty" 
          description="Looks like you haven't added anything yet."
          action={<div className="text-primary"><ShoppingBag size={48} className="mx-auto mt-4 opacity-20" /></div>}
        />
      )}
    </div>
  );
}
