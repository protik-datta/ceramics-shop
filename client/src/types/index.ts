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
}

export interface OrderPayload {
  productId: string;
  name: string;
  phone: string;
  address: string;
}

export interface OrderResponse {
  _id: string;
  total: number;
  advance: number;
  remaining: number;
}
