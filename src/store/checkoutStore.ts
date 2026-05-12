import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderUserInfo } from '../types/order';

interface CheckoutStore {
  savedInfo: OrderUserInfo;
  setSavedInfo: (info: OrderUserInfo) => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      savedInfo: {
        fullName: '',
        phone: '',
        altPhone: '',
        city: '',
        area: '',
        address: '',
        famousPlace: '',
      },
      setSavedInfo: (info) => set({ savedInfo: info }),
    }),
    {
      name: 'checkout-storage',
    }
  )
);
