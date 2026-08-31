import axiosInstance from './axiosInstance';
import type { Event } from '../types';

export interface EventQueryParams {
  search?: string;
  categoryId?: string;
}

/**
 * Obtener listado de eventos con opción de búsqueda y filtro por categoría (público)
 */
export const getEventsApi = async (params?: EventQueryParams): Promise<Event[]> => {
  const response = await axiosInstance.get<Event[]>('/events', { params });
  return response.data;
};

/**
 * Obtener detalle de un evento por su ID (público)
 */
export const getEventByIdApi = async (id: string): Promise<Event> => {
  const response = await axiosInstance.get<Event>(`/events/${id}`);
  return response.data;
};
