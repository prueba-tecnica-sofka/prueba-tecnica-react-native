import apiClient from './client';  
import { Product, ProductInput, ApiResponse } from './types';  
  
export const productsApi = {  
  // GET /bp/products  
  getProducts: async (): Promise<Product[]> => {  
    const response = await apiClient.get<ApiResponse<Product[]>>('/bp/products');  
    return response.data;  
  },  
  
  // POST /bp/products  
  createProduct: async (product: ProductInput): Promise<Product> => {  
    const response = await apiClient.post<ApiResponse<Product>>('/bp/products', product);  
    return response.data;  
  },  
  
  // PUT /bp/products/:id  
  updateProduct: async (id: string, product: Partial<ProductInput>): Promise<Product> => {  
    const response = await apiClient.put<ApiResponse<Product>>(`/bp/products/${id}`, product);  
    return response.data;  
  },  
  
  // DELETE /bp/products/:id  
  deleteProduct: async (id: string): Promise<void> => {  
    await apiClient.delete(`/bp/products/${id}`);  
  },  
  
  // GET /bp/products/verification/:id - CORREGIDO  
  verifyProductId: async (id: string): Promise<boolean> => {  
    try {  
      const response = await apiClient.get<boolean>(`/bp/products/verification/${id}`);  
      return response;  
    } catch (error) {  
      return false;  
    }  
  },  
};