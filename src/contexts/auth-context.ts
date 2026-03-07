import { createContext } from 'react';
import type { User } from '@/api/types';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Partial<User> | null;
  role: User['role'] | null;
}

export interface AuthContextValue extends AuthState {
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
