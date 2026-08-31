import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { STORAGE_KEYS, DEFAULT_API_URL } from '../utils/constants';

// Configuración de la URL base desde las variables de entorno Vite
const baseURL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de Solicitud (Request Interceptor)
// Añade el token JWT a la cabecera Authorization de cada petición
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta (Response Interceptor)
// Manejo centralizado de respuestas y errores HTTP
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Manejo de token expirado o no autorizado (401)
      if (error.response.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
      console.error(`[API Error ${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error('[API Error]: No hubo respuesta del servidor', error.request);
    } else {
      console.error('[API Error]: Error de configuración', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
