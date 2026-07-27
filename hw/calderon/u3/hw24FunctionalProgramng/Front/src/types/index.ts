// src/types/index.ts

export type UserRole = 'customer' | 'admin' | 'staff';

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  password_hash?: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Dish {
  dish_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category: string;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Ingredient {
  ingredient_id: string;
  name: string;
  unit: string;
  current_stock: number;
  min_stock: number;
  supplier?: string;
  created_at: Date;
  updated_at: Date;
}

export interface InventoryBatch {
  batch_id: string;
  ingredient_id: string;
  dish_id?: string;
  quantity: number;
  expiry_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  order_id: string;
  customer_id: string;
  total_amount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  order_date: Date;
  delivery_date?: Date;
  created_at: Date;
  updated_at: Date;
  customer?: User;
  orderDetails?: OrderDetail[];
}

export interface OrderDetail {
  detail_id: string;
  order_id: string;
  dish_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
  dish?: Dish;
}

export interface Reservation {
  reservation_id: string;
  customer_id: string;
  reservation_date: Date;
  party_size: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  special_requests?: string;
  created_at: Date;
  updated_at: Date;
  customer?: User;
}

export interface Survey {
  survey_id: string;
  customer_id: string;
  rating: number;
  comments?: string;
  submitted_at: Date;
  created_at: Date;
  customer?: User;
}

export interface FinancialReport {
  report_id: string;
  order_id: string;
  revenue: number;
  costs: number;
  profit: number;
  report_date: Date;
  created_at: Date;
}

export interface AuditLog {
  log_id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values?: string;
  new_values?: string;
  created_at: Date;
}

export interface AuthPayload {
  user_id: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
