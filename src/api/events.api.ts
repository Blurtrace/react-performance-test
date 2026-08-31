import axiosInstance from './axiosInstance';
import type { Event } from '../types';

export interface EventQueryParams {
  search?: string;
  categoryId?: string;
}

export interface CreateEventPayload {
  name: string;
  description?: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  images?: string[];
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

/**
 * Crear un evento (requiere JWT y rol admin)
 */
export const createEventApi = async (payload: CreateEventPayload): Promise<Event> => {
  const response = await axiosInstance.post<Event>('/events', payload);
  return response.data;
};

/**
 * Actualizar un evento (requiere JWT y rol admin)
 */
export const updateEventApi = async (
  id: string,
  payload: Partial<CreateEventPayload>
): Promise<Event> => {
  const response = await axiosInstance.patch<Event>(`/events/${id}`, payload);
  return response.data;
};

/**
 * Eliminar un evento (requiere JWT y rol admin)
 */
export const deleteEventApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/events/${id}`);
};

