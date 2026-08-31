import { createContext } from 'react';
import type { User, UserRole, AuthState, LoginCredentials, RegisterCredentials } from '../types';

export interface ExtendedAuthState extends AuthState {
  role: UserRole | null;
  error: string | null;
}

export interface AuthContextType extends ExtendedAuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<User | null>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

