import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { auth as authApi } from '../api/inventory';
import { getStoredToken, setStoredToken, isAxios401 } from '../api/client';
import type { User } from '../types/api';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then(setUser)
      .catch((err) => {
        if (isAxios401(err)) setStoredToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await authApi.login({ email, password });
    setUser(res.user);
  }

  async function register(name: string, email: string, password: string, password_confirmation: string) {
    const res = await authApi.register({ name, email, password, password_confirmation });
    setUser(res.user);
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
