import axios from 'axios';

export type ApiErrorKind = 'validation' | 'auth' | 'forbidden' | 'notFound' | 'conflict' | 'network' | 'unknown';

export interface NormalizedApiError {
  kind: ApiErrorKind;
  status?: number;
  message: string;
}

const statusMessages: Record<number, { kind: ApiErrorKind; message: string }> = {
  400: {
    kind: 'validation',
    message: 'La información enviada no es válida. Revisa los campos e intenta de nuevo.',
  },
  401: {
    kind: 'auth',
    message: 'Tu sesión no es válida o expiró. Inicia sesión nuevamente.',
  },
  403: {
    kind: 'forbidden',
    message: 'No tienes permisos para realizar esta acción.',
  },
  404: {
    kind: 'notFound',
    message: 'El recurso solicitado no fue encontrado.',
  },
  409: {
    kind: 'conflict',
    message: 'La acción no se puede completar porque existe un conflicto con la información actual.',
  },
};

const extractServerMessage = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object' || !('message' in value)) return undefined;
  const message = (value as { message?: unknown }).message;
  if (Array.isArray(message)) return message.map(String).join(', ');
  if (typeof message === 'string' && message.trim()) return message;
  return undefined;
};

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (axios.isAxiosError(error)) {
    if (!error.response || error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return {
        kind: 'network',
        message: 'No se pudo conectar con el servidor. Revisa tu conexión o intenta más tarde.',
      };
    }

    const status = error.response.status;
    const known = statusMessages[status];
    const serverMessage = extractServerMessage(error.response.data);

    if (known) {
      return {
        kind: known.kind,
        status,
        message: serverMessage || known.message,
      };
    }

    return {
      kind: 'unknown',
      status,
      message: serverMessage || 'Ocurrió un error inesperado. Intenta nuevamente.',
    };
  }

  if (error instanceof Error && error.message === 'Network Error') {
    return {
      kind: 'network',
      message: 'No se pudo conectar con el servidor. Revisa tu conexión o intenta más tarde.',
    };
  }

  return {
    kind: 'unknown',
    message: 'Ocurrió un error inesperado. Intenta nuevamente.',
  };
};
