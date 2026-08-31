import axiosInstance from './axiosInstance';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

/**
 * Iniciar sesión con email y contraseña
 */
export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

/**
 * Registrar un nuevo usuario
 */
export const registerApi = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
  return response.data;
};

/**
 * Cerrar sesión en el servidor (invalidación lógica en cliente/servidor)
 */
export const logoutApi = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>('/auth/logout');
  return response.data;
};

/**
 * Obtener la información del usuario autenticado actual (/users/me)
 */
export const getMeApi = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/users/me');
  return response.data;
};
