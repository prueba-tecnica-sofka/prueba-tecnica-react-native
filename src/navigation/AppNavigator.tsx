import React from 'react';  
import { NavigationContainer } from '@react-navigation/native';  
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';  
import {
  ProductDetailScreen,
  ProductFormScreen,
  ProductListScreen,
} from '../screens';
import { RootStackParamList } from './types';  
import { theme } from '../theme';
  
const Stack = createNativeStackNavigator<RootStackParamList>();  

const defaultScreenOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: theme.colors.primary,
  },
  headerTintColor: theme.colors.gray900,
  headerTitleStyle: {
    fontWeight: theme.typography.fontWeight.bold,
  },
};
  
const AppNavigator: React.FC = () => {  
  return (  
    <NavigationContainer>  
      <Stack.Navigator  
        initialRouteName="ProductList"  
        screenOptions={defaultScreenOptions}
      >  
        <Stack.Screen  
          name="ProductList"  
          component={ProductListScreen}  
          options={{ title: 'Productos Financieros' }}  
        />  
        <Stack.Screen  
          name="ProductDetail"  
          component={ProductDetailScreen}  
          options={{ title: 'Detalle del Producto' }}  
        />  
        <Stack.Screen  
          name="ProductForm"  
          component={ProductFormScreen}  
          options={({ route }) => ({  
            title: route.params.mode === 'create' ? 'Nuevo Producto' : 'Editar Producto',  
          })}  
        />  
      </Stack.Navigator>  
    </NavigationContainer>  
  );  
};  
  
export default AppNavigator;