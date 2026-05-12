import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';

interface UserState {
  currentUser: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAdmin: false,
      setUser: (user) => set({ currentUser: user, isAdmin: user?.role === 'admin' }),
    }),
    {
      name: 'user-storage',
    }
  )
);
