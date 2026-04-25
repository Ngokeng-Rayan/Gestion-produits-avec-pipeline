export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  products_count?: number;
  products?: Product[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  quantity: number;
  category_id: number | null;
  image: string | null;
  user_id: number;
  user?: User;
  category?: Category | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface DashboardStats {
  total_products: number;
  total_value: number;
  total_quantity: number;
  low_stock_products: number;
  out_of_stock_products: number;
  categories_count: number;
  products_by_category: Array<{
    category_id: number | null;
    count: number;
    category: { id: number; name: string } | null;
  }>;
  recent_products: Product[];
  top_value_products: Product[];
}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sort_by?: 'name' | 'price' | 'quantity' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
