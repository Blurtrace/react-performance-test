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

/**
 * Crear una nueva categoría (requiere rol admin)
 */
export const createCategoryApi = async (data: { name: string; description?: string }): Promise<Category> => {
  const response = await axiosInstance.post<Category>('/categories', data);
  return response.data;
};

/**
 * Actualizar una categoría existente (requiere rol admin)
 */
export const updateCategoryApi = async (
  id: string,
  data: { name?: string; description?: string }
): Promise<Category> => {
  const response = await axiosInstance.patch<Category>(`/categories/${id}`, data);
  return response.data;
};

/**
 * Eliminar una categoría por su ID (requiere rol admin)
 */
export const deleteCategoryApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};

