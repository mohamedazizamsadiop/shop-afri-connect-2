import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "kasuwa-auth-v1";
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      console.log('Login response:', response);
      
      // Stocker les tokens
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      
      // Utiliser les données de l'utilisateur depuis la réponse API
      const user: User = {
        id: response.user?.id || response.user?._id || response.id || response._id,
        email: response.user?.email || email,
        name: response.user?.name || email.split('@')[0],
        createdAt: response.user?.createdAt || new Date().toISOString(),
        role: response.user?.role || 'seller',
      };
      
      console.log('User set in context:', user);
      setUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || "Erreur lors de la connexion");
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authApi.register(name, email, password, 'seller');
      
      // Après l'inscription, connecter automatiquement
      await login(email, password);
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'inscription");
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch (error) {
        // Ignorer les erreurs lors du logout
      }
    }
    
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
