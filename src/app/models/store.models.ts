export type ProductCategory = 'WATCH' | 'STRAP' | 'ACCESSORY';
export type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface Product {
  id: string;
  name: string;
  collection: string;
  category: ProductCategory;
  price: number;
  imageUrl: string;
  badge?: string;
  stock: number;
}

export interface StoreOrder {
  id: string;
  customer: string;
  email: string;
  itemSummary: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number }>;
}