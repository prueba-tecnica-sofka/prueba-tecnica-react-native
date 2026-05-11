import React from 'react';
import { Text, View } from 'react-native';
import type { ProductFormRouteProp } from '../../navigation/types';

interface ProductFormScreenProps {
	route: ProductFormRouteProp;
}

const ProductFormScreen: React.FC<ProductFormScreenProps> = ({ route }) => {
	return (
		<View>
			<Text>Formulario de Producto</Text>
			<Text testID="product-form-mode">Modo: {route.params.mode}</Text>
		</View>
	);
};

export default ProductFormScreen;
