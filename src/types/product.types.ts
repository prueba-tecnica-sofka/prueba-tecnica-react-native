export interface Product {  
  id: string;  
  name: string;  
  description: string;  
  logo: string;  
  date_release: string;  
  date_revision: string;  
}

export interface ProductListProps {  
  products: Product[];  
  onProductPress: (productId: string) => void;  
  testID?: string;  
  isLoading?: boolean;
}