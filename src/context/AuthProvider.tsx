import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '../types';
import type { ExtendedAuthState } from './AuthContext';
import { STORAGE_KEYS } from '../utils/constants';
import { AuthContext } from './AuthContext';
import { loginApi, registerApi, logoutApi, getMeApi } from '../api/auth.api';

const getInitialAuthState = (): ExtendedAuthState => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

  if (token && savedUser) {
    try {
      const user: User = JSON.parse(savedUser);
      return {
        user,
        role: user.role ?? null,
        token,
        isAuthenticated: true,
        isLoading: true,
        error: null,
      };
    } catch {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  return {
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<ExtendedAuthState>(getInitialAuthState);

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const handleLogoutCleanState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setAuthState({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const getMe = useCallback(async (): Promise<User | null> => {
    try {
      const user = await getMeApi();
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setAuthState((prev) => ({
        ...prev,
        user,
        role: user.role,
        isAuthenticated: true,
        isLoading: false,
      }));
      return user;
    } catch {
      handleLogoutCleanState();
      return null;
    }
  }, [handleLogoutCleanState]);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      getMeApi()
        .then((user) => {
          if (!isMounted) return;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
          setAuthState((prev) => ({
            ...prev,
            user,
            role: user.role,
            isAuthenticated: true,
            isLoading: false,
          }));
        })
        .catch(() => {
          if (!isMounted) return;
          handleLogoutCleanState();
        });
    }
    return () => {
      isMounted = false;
    };
  }, [handleLogoutCleanState]);

  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await loginApi(credentials);
      const { accessToken, user } = response;

      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      setAuthState({
        user,
        role: user.role,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      let errorMessage = 'Error al iniciar sesión';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[] } } };
        const serverMsg = axiosError.response?.data?.message;
        if (serverMsg) {
          errorMessage = Array.isArray(serverMsg) ? serverMsg.join(', ') : serverMsg;
        }
      }
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage, { cause: err });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await registerApi(credentials);
      const { accessToken, user } = response;

      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      setAuthState({
        user,
        role: user.role,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      let errorMessage = 'Error al registrarse';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[] } } };
        const serverMsg = axiosError.response?.data?.message;
        if (serverMsg) {
          errorMessage = Array.isArray(serverMsg) ? serverMsg.join(', ') : serverMsg;
        }
      }
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage, { cause: err });
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Incluso si falla la llamada al servidor, limpiamos la sesión local
    } finally {
      handleLogoutCleanState();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        getMe,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
