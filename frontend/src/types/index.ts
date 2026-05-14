// Types cho Authentication
export interface User {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  data: User;
}

// Types cho Products
export interface ProductVariant {
  color: string;
  storage: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ProductSpecifications {
  screen?: string;
  chip?: string;
  battery?: string;
  os?: string;
  [key: string]: string | undefined;
}

export interface ProductRatings {
  average: number;
  count: number;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string | Category;
  description: string;
  specifications?: ProductSpecifications;
  variants?: ProductVariant[];
  images: string[];
  ratings: ProductRatings;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  brand: string;
  category: string;
  description: string;
  specifications?: ProductSpecifications;
  variants: ProductVariant[];
  images: string[];
}

// Types cho Category
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent_id?: string;
  createdAt: string;
  updatedAt: string;
}

// Types cho Orders
export interface OrderItem {
  productId: string | Product;
  name: string;
  quantity: number;
  price: number;
  sku?: string;
}

export interface Order {
  _id: string;
  userId: string | User;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}

// Types cho Reviews
export interface Review {
  _id: string;
  productId: string;
  userId: string | User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}

// Types cho Cart (Local)
export interface CartItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  sku?: string; // Để phân biệt cùng sản phẩm nhưng khác variant (màu/dung lượng)
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

// Types cho API Response
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  statusCode?: number;
  count?: number;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  error?: string;
}

// Types cho Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

// Types cho Filter
export interface ProductFilter {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

// Types cho Notification
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Types cho Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueByDay: Array<{ date: string; revenue: number }>;
  ordersByStatus: {
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}
