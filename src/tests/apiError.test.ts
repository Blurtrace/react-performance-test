import axios from 'axios';
import { describe, expect, it } from 'vitest';
import { normalizeApiError } from '../utils/apiError';

describe('normalizeApiError', () => {
  it('normaliza un error de red', () => {
    const normalized = normalizeApiError(new Error('Network Error'));
    expect(normalized.kind).toBe('network');
  });

  it('diferencia un error de validación 400', () => {
    const error = new axios.AxiosError('Bad request', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {},
      data: {},
    });

    expect(normalizeApiError(error)).toMatchObject({ kind: 'validation', status: 400 });
  });
});

