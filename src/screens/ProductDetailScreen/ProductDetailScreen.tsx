import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/common/Button/Button';
import type { RootStackParamList, ProductDetailRouteProp } from '../../navigation/types';
import { productDetailStyles } from './ProductDetailScreen.styles';

type ProductDetailNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	'ProductDetail'
>;

interface ProductDetailScreenProps {
	route: ProductDetailRouteProp;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
	const navigation = useNavigation<ProductDetailNavigationProp>();
	const { productId } = route.params;

	const handleEditPress = (): void => {
		navigation.navigate('ProductForm', {
			mode: 'edit',
			productId,
		});
	};

	return (
		<View style={productDetailStyles.container}>
			<ScrollView contentContainerStyle={productDetailStyles.scrollContent}>
				<View style={productDetailStyles.header}>
					<Text style={productDetailStyles.eyebrow}>Producto financiero</Text>
					<Text style={productDetailStyles.title}>Detalle del Producto</Text>
					<Text style={productDetailStyles.subtitle}>
						Revisa la información principal y edita el registro si necesitas actualizarlo.
					</Text>
				</View>

				<View style={productDetailStyles.card}>
					<Text style={productDetailStyles.label}>ID del producto</Text>
					<Text testID="product-detail-id" style={productDetailStyles.value}>
						{productId}
					</Text>
				</View>

				<View style={productDetailStyles.actions}>
					<Button
						testID="edit-product-button"
						title="Editar"
						variant="secondary"
						onPress={handleEditPress}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

export default ProductDetailScreen;
