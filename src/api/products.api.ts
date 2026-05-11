import apiClient from './client';  
import { Product, ProductInput, ApiResponse } from './types';  

const unwrapData = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
};

const normalizeProductsList = (payload: unknown): Product[] => {
  const parsed = unwrapData<unknown>(payload);

  if (Array.isArray(parsed)) {
    return parsed as Product[];
  }

  if (parsed && typeof parsed === 'object') {
    return [parsed as Product];
  }

  return [];
};

const normalizeProduct = (payload: unknown): Product => {
  return unwrapData<Product>(payload);
};

const normalizeBoolean = (payload: unknown): boolean => {
  const parsed = unwrapData<unknown>(payload);
  return typeof parsed === 'boolean' ? parsed : false;
};
  
export const productsApi = {  
  // GET /bp/products  
  getProducts: async (): Promise<Product[]> => {  
    const response = await apiClient.get<ApiResponse<Product[]> | Product[]>('/bp/products');  
    return normalizeProductsList(response);
  },  

  // GET /bp/products/:id
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product> | Product>(`/bp/products/${id}`);
    return normalizeProduct(response);
  },
  
  // POST /bp/products  
  createProduct: async (product: ProductInput): Promise<Product> => {  
    const response = await apiClient.post<ApiResponse<Product> | Product>('/bp/products', product);  
    return normalizeProduct(response);
  },  
  
  // PUT /bp/products/:id  
  updateProduct: async (id: string, product: Partial<ProductInput>): Promise<Product> => {  
    const response = await apiClient.put<ApiResponse<Product> | Product>(`/bp/products/${id}`, product);  
    return normalizeProduct(response);
  },  
  
  // DELETE /bp/products/:id  
  deleteProduct: async (id: string): Promise<void> => {  
    await apiClient.delete(`/bp/products/${id}`);  
  },  
  
  // GET /bp/products/verification/:id - CORREGIDO  
  verifyProductId: async (id: string): Promise<boolean> => {  
    try {  
      const response = await apiClient.get<boolean | ApiResponse<boolean>>(`/bp/products/verification/${id}`);  
      return normalizeBoolean(response);
    } catch {  
      return false;  
    }  
  },  
};