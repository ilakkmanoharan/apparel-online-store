export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockCount: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  addresses?: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  shippingAddress: Address;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "needs_review";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  stripeSessionId?: string;
  stripeCustomerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
