export interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  salePrice: number | null;
  quantity: number;
  maxStock: number;
  addedAt: number;
  expiresAt: number;
  selectedOptions?: Record<string, string>;
  isSelected?: boolean;
}

export interface CartStore {
  activeUserId: string;
  userCarts: Record<string, CartItem[]>;
  items: CartItem[]; // Active user's items
  switchUser: (userId: string) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSelection: (productId: string) => void;
  toggleAllSelection: (selected: boolean) => void;
  clearCart: () => void;
  removeSelectedItems: () => void;
  syncStockOverrides: (records: {productId: string, maxStock: number}[]) => void;
  hydrate: (items: CartItem[]) => void;
}
