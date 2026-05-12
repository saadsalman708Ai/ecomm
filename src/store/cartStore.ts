import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartStore } from '../types/cart';
import { useUserStore } from './userStore';

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      activeUserId: 'guest',
      userCarts: {},
      items: [],
      switchUser: (userId) => set((state) => {
        if (state.activeUserId === userId) return state;

        const newCarts = { ...state.userCarts, [state.activeUserId]: state.items };
        let newItems = newCarts[userId] || [];

        // If logging in (guest -> real user), merge the guest cart into the user's cart
        if (state.activeUserId === 'guest' && userId !== 'guest') {
          const guestItems = newCarts['guest'] || [];
          if (guestItems.length > 0) {
            const mergedItems = [...newItems];
            
            guestItems.forEach((guestItem) => {
              const existingIdx = mergedItems.findIndex((i) => i.productId === guestItem.productId);
              if (existingIdx !== -1) {
                const existing = mergedItems[existingIdx];
                mergedItems[existingIdx] = {
                  ...existing,
                  quantity: Math.min(existing.maxStock ?? guestItem.maxStock ?? Infinity, existing.quantity + guestItem.quantity)
                };
              } else {
                mergedItems.push(guestItem);
              }
            });

            newItems = mergedItems;
            newCarts[userId] = newItems;
            newCarts['guest'] = []; // Clear the guest cart after transferring items
          }
        }

        return {
          activeUserId: userId,
          userCarts: newCarts,
          items: newItems
        };
      }),
      addItem: (item) =>
        set((state) => {
          const itemWithSelection = { ...item, isSelected: item.isSelected ?? true };
          const existingItem = state.items.find((i) => i.productId === item.productId);
          let newItems;
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: Math.min(i.maxStock ?? item.maxStock ?? Infinity, i.quantity + item.quantity) }
                : i
            );
          } else {
             newItems = [...state.items, itemWithSelection];
          }
          return { items: newItems, userCarts: { ...state.userCarts, [state.activeUserId]: newItems } };
        }),
      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          return { items: newItems, userCarts: { ...state.userCarts, [state.activeUserId]: newItems } };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.min(i.maxStock ?? Infinity, Math.max(1, quantity)) } : i
          );
          return { items: newItems, userCarts: { ...state.userCarts, [state.activeUserId]: newItems } };
        }),
      toggleSelection: (productId) => 
        set((state) => {
          const newItems = state.items.map((i) =>
            i.productId === productId ? { ...i, isSelected: !(i.isSelected ?? true) } : i
          );
          return { items: newItems, userCarts: { ...state.userCarts, [state.activeUserId]: newItems } };
        }),
      toggleAllSelection: (selected) => 
        set((state) => {
          const newItems = state.items.map((i) => ({ 
            ...i, 
            isSelected: (i.maxStock === 0) ? false : selected // NEVER select an out of stock item
          }));
          return { items: newItems, userCarts: { ...state.userCarts, [state.activeUserId]: newItems } };
        }),
      clearCart: () => set((state) => ({ 
        items: [], 
        userCarts: { ...state.userCarts, [state.activeUserId]: [] } 
      })),
      removeSelectedItems: () => set((state) => {
        const newItems = state.items.filter((i) => (i.isSelected ?? true) === false);
        return { items: newItems, userCarts: { ...state.userCarts, [state.activeUserId]: newItems } };
      }),
      syncStockOverrides: (records) => 
        set((state) => {
          let changed = false;
          const newItems = state.items.map(item => {
             const record = records.find(r => r.productId === item.productId);
             if (record) {
               let newQuantity = Math.min(record.maxStock, item.quantity);
               let newSelected = item.isSelected ?? true;
               if (record.maxStock === 0) {
                  newQuantity = 0;
                  newSelected = false; 
               } else if (item.quantity === 0 && record.maxStock > 0) {
                  newQuantity = 1;
               }
               if (newQuantity !== item.quantity || record.maxStock !== item.maxStock || newSelected !== item.isSelected) {
                  changed = true;
               }
               return { ...item, maxStock: record.maxStock, quantity: newQuantity, isSelected: newSelected };
             }
             return item;
          });
          return changed ? { items: newItems, userCarts: { ...state.userCarts, [state.activeUserId]: newItems } } : state;
        }),
      hydrate: (items) => set((state) => ({ 
         items, 
         userCarts: { ...state.userCarts, [state.activeUserId]: items } 
      })),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Subscribe to user changes to automatically switch carts
useUserStore.subscribe((state) => {
  const userId = state.currentUser?.id || 'guest';
  useCartStore.getState().switchUser(userId);
});
