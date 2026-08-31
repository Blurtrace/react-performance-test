import axiosInstance from './axiosInstance';
import type { Category } from '../types';

/**
 * Obtener listado de todas las categorías (público)
 */
export const getCategoriesApi = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>('/categories');
  return response.data;
};

/**
 * Obtener detalle de una categoría por su ID (público)
 */
export const getCategoryByIdApi = async (id: string): Promise<Category> => {
  const response = await axiosInstance.get<Category>(`/categories/${id}`);
  return response.data;
};
