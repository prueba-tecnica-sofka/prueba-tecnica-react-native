import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';  
  
export type RootStackParamList = {  
  ProductList: undefined;  
  ProductDetail: { productId: string };  
  ProductForm: {   
    mode: 'create' | 'edit';   
    productId?: string;  
  };  
};  
  
export type ProductListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;  
export type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;  
export type ProductFormRouteProp = RouteProp<RootStackParamList, 'ProductForm'>;