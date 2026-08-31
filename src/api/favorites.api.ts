import axiosInstance from './axiosInstance';
import type { Event } from '../types';

/**
 * Obtener los eventos favoritos del usuario autenticado (GET /favorites)
 */
export const getFavoritesApi = async (): Promise<Event[]> => {
  const response = await axiosInstance.get<Event[]>('/favorites');
  return response.data;
};

/**
 * Agregar un evento a favoritos (POST /favorites/:eventId)
 */
export const addFavoriteApi = async (eventId: string): Promise<unknown> => {
  const response = await axiosInstance.post(`/favorites/${eventId}`);
  return response.data;
};

/**
 * Eliminar un evento de favoritos (DELETE /favorites/:eventId)
 */
export const removeFavoriteApi = async (eventId: string): Promise<void> => {
  await axiosInstance.delete(`/favorites/${eventId}`);
};
