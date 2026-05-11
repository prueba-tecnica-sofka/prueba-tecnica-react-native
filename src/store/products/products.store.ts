import type { Product, ProductInput } from '../../api/types';
  
export interface ProductsState {  
  products: Product[];  
  filteredProducts: Product[];  
  searchTerm: string;  
  isLoading: boolean;  
  error: string | null;  
    
  // Actions  
  fetchProducts: () => Promise<void>;  
  createProduct: (product: ProductInput) => Promise<void>;  
  updateProduct: (id: string, product: ProductInput) => Promise<void>;  
  deleteProduct: (id: string) => Promise<void>;  
  setSearchTerm: (term: string) => void;  
  verifyProductId: (id: string) => Promise<boolean>;  
}