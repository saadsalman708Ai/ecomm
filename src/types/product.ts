export interface ProductOption {
  title: string;
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  salePrice: number | null;
  salePercent: number | null;
  quantity: number;
  tags: string[];
  soldCount: number;
  inOrder?: number;
  adminNote: string;
  options?: ProductOption[];
  createdAt: number; // Storing as milliseconds timestamp in TS
  updatedAt: number;
}
