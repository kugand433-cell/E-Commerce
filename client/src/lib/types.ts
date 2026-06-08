export type Role = "customer" | "seller" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  address?: Address;
  isActive?: boolean;
  createdAt?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  category: string | Category;
  seller: string | User;
  brand?: string;
  tags?: string[];
  specs?: Record<string, string>;
  rating?: number;
  numReviews?: number;
  isActive?: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  product: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  buyer: string | User;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: "COD" | "online";
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: User | string;
  rating: number;
  comment: string;
  createdAt: string;
}
