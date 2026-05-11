const DEFAULT_API_BASE_URL = 'http://localhost:3002';

type EnvShape = {
  EXPO_PUBLIC_API_URL?: string;
};

const readExpoPublicApiUrl = (): string | undefined => {
  const maybeProcess = (globalThis as { process?: { env?: EnvShape } }).process;
  const envValue = maybeProcess?.env?.EXPO_PUBLIC_API_URL;

  if (typeof envValue !== 'string') {
    return undefined;
  }

  const trimmed = envValue.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeBaseUrl = (url: string): string => {
  return url.replace(/\/+$/, '');
};

export const API_BASE_URL = normalizeBaseUrl(
  readExpoPublicApiUrl() ?? DEFAULT_API_BASE_URL
);

export const getApiBaseUrl = (): string => API_BASE_URL;