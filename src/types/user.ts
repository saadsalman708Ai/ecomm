export interface UserSavedInfo {
  fullName: string;
  phone: string;
  altPhone: string | null;
  city: string;
  area: string;
  address: string;
  famousPlace: string | null;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  savedInfo: UserSavedInfo | null;
  createdAt: number;
}
