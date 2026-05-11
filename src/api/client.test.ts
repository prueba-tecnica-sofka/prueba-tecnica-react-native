import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import apiClient from './client';
import { AppError, NotFoundError, ValidationError } from './errors';

const createMockResponse = ({
  ok = true,
  status = 200,
  contentType = 'application/json',
  body = '',
}: {
  ok?: boolean;
  status?: number;
  contentType?: string;
  body?: string;
}): Response => {
  return {
    ok,
    status,
    headers: {
      get: jest.fn(() => contentType),
    },
    text: jest.fn(async () => body),
  } as unknown as Response;
};

describe('apiClient', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it('hace GET y parsea JSON correctamente', async () => {
    const response = createMockResponse({ body: JSON.stringify({ data: { ok: true } }) });
    (global.fetch as jest.Mock).mockResolvedValue(response);

    const result = await apiClient.get<{ data: { ok: boolean } }>('/health');

    expect(result).toEqual({ data: { ok: true } });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3002/health',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('hace POST serializando body', async () => {
    const response = createMockResponse({ body: JSON.stringify({ id: 'abc' }) });
    (global.fetch as jest.Mock).mockResolvedValue(response);

    const payload = { name: 'Cuenta' };
    await apiClient.post('/products', payload);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3002/products',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });

  it('retorna texto plano cuando content-type no es JSON', async () => {
    const response = createMockResponse({ contentType: 'text/plain', body: 'plain-response' });
    (global.fetch as jest.Mock).mockResolvedValue(response);

    const result = await apiClient.get<string>('/plain');
    expect(result).toBe('plain-response');
  });

  it('retorna undefined en 204 No Content', async () => {
    const response = createMockResponse({ status: 204, body: '' });
    (global.fetch as jest.Mock).mockResolvedValue(response);

    const result = await apiClient.delete('/products/1');
    expect(result).toBeUndefined();
  });

  it('mapea 404 a NotFoundError', async () => {
    const response = createMockResponse({
      ok: false,
      status: 404,
      body: JSON.stringify({ message: 'No existe' }),
    });
    (global.fetch as jest.Mock).mockResolvedValue(response);

    await expect(apiClient.get('/missing')).rejects.toBeInstanceOf(NotFoundError);
    await expect(apiClient.get('/missing')).rejects.toMatchObject({ message: 'No existe' });
  });

  it('mapea 400 a ValidationError', async () => {
    const response = createMockResponse({
      ok: false,
      status: 400,
      body: JSON.stringify({ error: 'Datos invalidos' }),
    });
    (global.fetch as jest.Mock).mockResolvedValue(response);

    await expect(apiClient.put('/products/1', {})).rejects.toBeInstanceOf(ValidationError);
  });

  it('normaliza AbortError como timeout', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';
    (global.fetch as jest.Mock).mockRejectedValue(abortError);

    await expect(apiClient.get('/timeout')).rejects.toMatchObject({
      message: 'Timeout de la solicitud',
      statusCode: 408,
    });
  });

  it('normaliza fallos de red a AppError', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network request failed'));

    await expect(apiClient.get('/network')).rejects.toBeInstanceOf(AppError);
    await expect(apiClient.get('/network')).rejects.toMatchObject({ statusCode: 0 });
  });
});
