export interface User {
  id: string;
  email?: string;
  phone?: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin' | 'super_admin' | 'vendeuse';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: string[];
  colors: Color[];
  stock: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Color {
  name: string;
  hex: string;
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  subcategories?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 