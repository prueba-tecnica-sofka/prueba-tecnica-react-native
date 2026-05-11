import React from 'react';
import { Text, View } from 'react-native';
import type { ProductDetailRouteProp } from '../../navigation/types';

interface ProductDetailScreenProps {
	route: ProductDetailRouteProp;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
	return (
		<View>
			<Text>Detalle del Producto</Text>
			<Text testID="product-detail-id">ID: {route.params.productId}</Text>
		</View>
	);
};

export default ProductDetailScreen;
