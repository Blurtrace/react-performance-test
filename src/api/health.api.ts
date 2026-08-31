import axiosInstance from './axiosInstance';

export interface HealthCheckResponse {
  connected: boolean;
  message: string;
}

/**
 * Función para verificar la conexión con el servidor Backend (PlanCity API)
 */
export const checkBackendHealth = async (): Promise<HealthCheckResponse> => {
  try {
    // Probamos conectividad realizando una petición GET a un endpoint público como /categories o /events
    await axiosInstance.get('/categories');
    return {
      connected: true,
      message: 'Conexión exitosa con la API de PlanCity',
    };
  } catch {
    return {
      connected: false,
      message: 'No se pudo establecer conexión con el backend',
    };
  }
};
