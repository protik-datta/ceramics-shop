export type Status = 'pending' | 'confirmed' | 'cancelled';

export interface Order {
  _id: string;
  productName: string;
  customer: { name: string; phone: string; address: string };
  total: number;
  advance: number;
  remaining: number;
  status: Status;
  createdAt: string;
}

export interface Product {
  _id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  advance: number;
  image: string;
  badge: string;
  order: number;
  active: boolean;
}

export interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  revenue: number;
  advance: number;
  today: number;
}

export interface Paged<T> { data: T[]; page: number; pages: number; total: number }
