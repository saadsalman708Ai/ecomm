export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  salePrice: number | null;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface OrderUserInfo {
  fullName: string;
  phone: string;
  altPhone: string | null;
  city: string;
  area: string;
  address: string;
  famousPlace: string | null;
}

export type OrderStatus = 'waiting' | 'approved' | 'pending' | 'completed' | 'canceled';

export interface Order {
  id: string;
  userId: string;
  userInfo: OrderUserInfo;
  items: OrderItem[];
  deliveryCharges: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
  adminNote?: string;
  canceledBy?: 'user' | 'admin';
}
