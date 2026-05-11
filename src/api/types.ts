import type { AppError } from './errors';

export interface Product {  
  id: string;  
  name: string;  
  description: string;  
  logo: string;  
  date_release: string;  
  date_revision: string;  
}  
  
export interface ProductInput {  
  id: string;  
  name: string;  
  description: string;  
  logo: string;  
  date_release: string;  
  date_revision: string;  
}  
  
export interface ApiResponse<T> {  
  data: T;  
}  
  
export interface ApiError {  
  message: string;  
  error?: string;  
}  
  
export interface RequestConfig {  
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';  
  headers?: Record<string, string>;  
  body?: unknown;
  timeout?: number;  
}  
  
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;  
export type ResponseInterceptor<T = any> = (response: T) => T | Promise<T>;  
export type ErrorInterceptor = (error: AppError) => AppError | Promise<AppError>;