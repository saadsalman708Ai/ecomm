export const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  USERS: 'users',
  HOME_CONFIG: 'homeConfig',
  CATEGORIES: 'categories',
  CONFIG: 'config' // parent for contactConfig
} as const;

export const DOCUMENTS = {
  CONTACT_CONFIG: 'contactConfig',
  HOME_CONFIG: 'homeConfig',
  STORE_CONFIG: 'storeConfig',
  APP_SETTINGS: 'appSettings'
} as const;
