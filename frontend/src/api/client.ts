import axios from 'axios';

const base = import.meta.env.VITE_API_BASEURL ?? '/api';

export const api = axios.create({ baseURL: base });

const TOKEN_KEY = 'sp_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

api.interceptors.request.use((config) => {
  const t = getStoredToken();
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export function isAxios401(err: unknown) {
  return axios.isAxiosError(err) && err.response?.status === 401;
}

export function extractMessage(err: unknown, fallback = 'Une erreur est survenue'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (data?.message) return data.message;
    if (data?.errors) {
      const first = Object.values(data.errors)[0];
      if (Array.isArray(first) && first.length) return first[0] as string;
    }
  }
  return fallback;
}
