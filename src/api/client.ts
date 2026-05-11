import { ErrorMessages } from '../utils/error.messages';
import { AppError, NetworkError, NotFoundError, ValidationError } from './errors';
import { RequestConfig, RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from './types';  
import { getApiBaseUrl } from './config';
  
const BASE_URL = getApiBaseUrl();  
const DEFAULT_TIMEOUT = 10000;  
  
class ApiClient {  
  private baseUrl: string;  
  private defaultTimeout: number;  
  private requestInterceptors: RequestInterceptor[] = [];  
  private responseInterceptors: ResponseInterceptor[] = [];  
  private errorInterceptors: ErrorInterceptor[] = [];  
  
  constructor(baseUrl: string = BASE_URL, timeout: number = DEFAULT_TIMEOUT) {  
    this.baseUrl = baseUrl;  
    this.defaultTimeout = timeout;  
  }  
  
  // Agregar interceptor de request  
  addRequestInterceptor(interceptor: RequestInterceptor): void {  
    this.requestInterceptors.push(interceptor);  
  }  
  
  // Agregar interceptor de response  
  addResponseInterceptor(interceptor: ResponseInterceptor): void {  
    this.responseInterceptors.push(interceptor);  
  }  
  
  // Agregar interceptor de error  
  addErrorInterceptor(interceptor: ErrorInterceptor): void {  
    this.errorInterceptors.push(interceptor);  
  }  
  
  // Ejecutar interceptores de request  
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {  
    let processedConfig = config;  
    for (const interceptor of this.requestInterceptors) {  
      processedConfig = await interceptor(processedConfig);  
    }  
    return processedConfig;  
  }  
  
  // Ejecutar interceptores de response  
  private async applyResponseInterceptors<T>(response: T): Promise<T> {  
    let processedResponse = response;  
    for (const interceptor of this.responseInterceptors) {  
      processedResponse = await interceptor(processedResponse);  
    }  
    return processedResponse;  
  }  
  
  // Ejecutar interceptores de error  
  private async applyErrorInterceptors(error: AppError): Promise<AppError> {  
    let processedError = error;  
    for (const interceptor of this.errorInterceptors) {  
      processedError = await interceptor(processedError);  
    }  
    return processedError;  
  }  
  
  // Crear URL completa  
  private buildUrl(endpoint: string): string {  
    return `${this.baseUrl}${endpoint}`;  
  }  
  
  // Crear AbortController para timeout
  private createTimeoutController(timeout: number): {
    controller: AbortController;
    timeoutId: ReturnType<typeof setTimeout>;
  } {
    const controller = new AbortController();  
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    return { controller, timeoutId };
  }  
  
  // Parsear respuesta de forma segura incluso cuando el body es vacio
  private async parseResponse(response: Response): Promise<unknown> {
    if (response.status === 204) {
      return undefined;
    }

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    if (!rawText) {
      return undefined;
    }

    if (contentType.includes('application/json')) {
      try {
        return JSON.parse(rawText) as unknown;
      } catch {
        return rawText;
      }
    }

    return rawText;
  }

  private getMessageFromPayload(data: unknown): string | undefined {
    if (!data || typeof data !== 'object') {
      return undefined;
    }

    const payload = data as { message?: unknown; error?: unknown };

    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error;
    }

    return undefined;
  }

  private getFallbackMessageByStatus(status: number): string {
    if (status === 401 || status === 403) {
      return ErrorMessages.UNAUTHORIZED;
    }

    if (status === 404) {
      return ErrorMessages.PRODUCT_NOT_FOUND;
    }

    if (status >= 500) {
      return ErrorMessages.SERVER_UNAVAILABLE;
    }

    return ErrorMessages.UNKNOWN_ERROR;
  }

  // Manejo de errores de fetch
  private handleFetchError(error: unknown): AppError {
    if (error instanceof Error) {  
      if (error.name === 'AbortError') {  
        return new AppError('Timeout de la solicitud', 408, error);
      }  
      if (error.message.includes('Network request failed')) {  
        return new NetworkError(`${ErrorMessages.NETWORK_ERROR} API: ${this.baseUrl}`);
      }  
      return new AppError(error.message, 500, error);
    }  
    return new AppError(ErrorMessages.UNKNOWN_ERROR, 500, error);
  }  
  
  // Manejo de errores de respuesta HTTP
  private handleHttpError(response: Response, data: unknown): never {
    const status = response.status;
    const message =
      this.getMessageFromPayload(data) || this.getFallbackMessageByStatus(status);

    if (status === 404) {
      throw new NotFoundError(message);
    }

    if (status === 400 || status === 422) {
      throw new ValidationError(message);
    }

    throw new AppError(message, status, data);
  }  
  
  // Método principal de fetch  
  private async fetch<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {  
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {  
      // Aplicar interceptores de request  
      const processedConfig = await this.applyRequestInterceptors({  
        ...config,  
        headers: {  
          'Content-Type': 'application/json',  
          ...config.headers,  
        },  
      });  
  
      // Preparar URL y opciones  
      const url = this.buildUrl(endpoint);  
      const timeout = processedConfig.timeout || this.defaultTimeout;  
      const timeoutController = this.createTimeoutController(timeout);
      const { controller } = timeoutController;
      timeoutId = timeoutController.timeoutId;
  
      const options: RequestInit = {  
        method: processedConfig.method || 'GET',  
        headers: processedConfig.headers,  
        body: processedConfig.body ? JSON.stringify(processedConfig.body) : undefined,  
        signal: controller.signal,  
      };  
  
      console.log(`[API] ${options.method} ${url}`);  
  
      // Ejecutar fetch  
      const response = await fetch(url, options);  
  
      // Parsear respuesta
      const data = await this.parseResponse(response);
  
      // Manejar errores HTTP  
      if (!response.ok) {  
        this.handleHttpError(response, data);  
      }  
  
      // Aplicar interceptores de response  
      const processedData = await this.applyResponseInterceptors(data);
  
      return processedData as T;
  
    } catch (error) {  
      // Si ya es un AppError, aplicar interceptores de error  
      if (error instanceof AppError) {  
        const processedError = await this.applyErrorInterceptors(error);  
        throw processedError;  
      }  
  
      // Si es otro tipo de error, normalizarlo y aplicar interceptores
      const normalizedError = this.handleFetchError(error);
      const processedError = await this.applyErrorInterceptors(normalizedError);
      throw processedError;
    } finally {
      // Evita timers colgando en solicitudes resueltas antes del timeout.
      if (typeof timeoutId !== 'undefined') {
        clearTimeout(timeoutId);
      }
    }  
  }  
  
  // Métodos HTTP convenientes  
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {  
    return this.fetch<T>(endpoint, { ...config, method: 'GET' });  
  }  
  
  async post<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
    return this.fetch<T>(endpoint, { ...config, method: 'POST', body });  
  }  
  
  async put<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
    return this.fetch<T>(endpoint, { ...config, method: 'PUT', body });  
  }  
  
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {  
    return this.fetch<T>(endpoint, { ...config, method: 'DELETE' });  
  }  
}  
  
// Crear instancia del cliente  
export const apiClient = new ApiClient();  
  
// Configurar interceptores por defecto  
  
// Request interceptor: logging  
apiClient.addRequestInterceptor((config) => {  
  console.log(`[API Request] ${config.method} ${config.body ? JSON.stringify(config.body) : ''}`);  
  return config;  
});  
  
// Response interceptor: logging  
apiClient.addResponseInterceptor((response) => {  
  console.log('[API Response]', response);  
  return response;  
});  
  
// Error interceptor: logging y transformación  
apiClient.addErrorInterceptor((error) => {  
  console.error(`[API Error] ${error.statusCode}: ${error.message}`);  
  return error;  
});  
  
export default apiClient;