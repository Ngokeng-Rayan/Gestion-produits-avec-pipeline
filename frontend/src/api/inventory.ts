import { api, setStoredToken } from './client';
import type {
  AuthResponse,
  Category,
  DashboardStats,
  PaginatedResponse,
  Product,
  ProductFilters,
} from '../types/api';

export const auth = {
  async register(body: { name: string; email: string; password: string; password_confirmation: string }) {
    const { data } = await api.post<AuthResponse>('/register', body);
    setStoredToken(data.token);
    return data;
  },
  async login(body: { email: string; password: string }) {
    const { data } = await api.post<AuthResponse>('/login', body);
    setStoredToken(data.token);
    return data;
  },
  async me() {
    const { data } = await api.get<AuthResponse['user']>('/me');
    return data;
  },
  async logout() {
    try {
      await api.post('/logout');
    } finally {
      setStoredToken(null);
    }
  },
};

export const dashboard = {
  async stats() {
    const { data } = await api.get<DashboardStats>('/dashboard/stats');
    return data;
  },
};

export const products = {
  async list(filters: ProductFilters = {}) {
    const params: Record<string, string | number | boolean> = {};
    if (filters.search) params.search = filters.search;
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.min_price !== undefined) params.min_price = filters.min_price;
    if (filters.max_price !== undefined) params.max_price = filters.max_price;
    if (filters.in_stock) params.in_stock = true;
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (filters.sort_order) params.sort_order = filters.sort_order;
    if (filters.per_page) params.per_page = filters.per_page;
    if (filters.page) params.page = filters.page;
    const { data } = await api.get<PaginatedResponse<Product>>('/products', { params });
    return data;
  },
  async get(id: number) {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },
  async create(body: Record<string, unknown>) {
    const { data } = await api.post<Product>('/products', body);
    return data;
  },
  async update(id: number, body: Record<string, unknown>) {
    const { data } = await api.put<Product>(`/products/${id}`, body);
    return data;
  },
  async delete(id: number) {
    await api.delete(`/products/${id}`);
  },
};

export const categories = {
  async list() {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },
  async get(id: number) {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },
  async create(body: { name: string; slug: string; description?: string }) {
    const { data } = await api.post<Category>('/categories', body);
    return data;
  },
  async update(id: number, body: Partial<Category>) {
    const { data } = await api.put<Category>(`/categories/${id}`, body);
    return data;
  },
  async delete(id: number) {
    await api.delete(`/categories/${id}`);
  },
};
