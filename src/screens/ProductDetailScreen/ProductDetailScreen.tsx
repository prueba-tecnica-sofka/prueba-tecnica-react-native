import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/common/Button/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage/ErrorMessage';
import { productsApi } from '../../api/products.api';
import type { Product } from '../../api/types';
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

	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadProduct = async (): Promise<void> => {
			try {
				setIsLoading(true);
				setError(null);
				const data = await productsApi.getProductById(productId);
				setProduct(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al cargar el producto');
			} finally {
				setIsLoading(false);
			}
		};
		void loadProduct();
	}, [productId]);

	const handleEditPress = (): void => {
		navigation.navigate('ProductForm', {
			mode: 'edit',
			productId,
		});
	};

	if (isLoading) {
		return (
			<View style={productDetailStyles.centered}>
				<ActivityIndicator size="large" testID="product-detail-loading" />
			</View>
		);
	}

	if (error || !product) {
		return (
			<View style={productDetailStyles.centered}>
				<ErrorMessage message={error ?? 'Producto no encontrado'} visible />
			</View>
		);
	}

	return (
		<View style={productDetailStyles.container}>
			<ScrollView contentContainerStyle={productDetailStyles.scrollContent}>
				<View style={productDetailStyles.header}>
					<Text style={productDetailStyles.eyebrow}>Producto financiero</Text>
					<Text style={productDetailStyles.title}>{product.name}</Text>
					<Text style={productDetailStyles.subtitle}>{product.description}</Text>
				</View>

				{product.logo ? (
					<Image
						source={{ uri: product.logo }}
						style={productDetailStyles.logo}
						resizeMode="contain"
						testID="product-detail-logo"
					/>
				) : null}

				<View style={productDetailStyles.card}>
					<View style={productDetailStyles.row}>
						<Text style={productDetailStyles.label}>ID</Text>
						<Text testID="product-detail-id" style={productDetailStyles.value}>{product.id}</Text>
					</View>
					<View style={productDetailStyles.row}>
						<Text style={productDetailStyles.label}>Nombre</Text>
						<Text testID="product-detail-name" style={productDetailStyles.value}>{product.name}</Text>
					</View>
					<View style={productDetailStyles.row}>
						<Text style={productDetailStyles.label}>Descripción</Text>
						<Text testID="product-detail-description" style={productDetailStyles.value}>{product.description}</Text>
					</View>
					<View style={productDetailStyles.row}>
						<Text style={productDetailStyles.label}>Fecha de liberación</Text>
						<Text testID="product-detail-date-release" style={productDetailStyles.value}>
							{new Date(product.date_release).toLocaleDateString('es-CO')}
						</Text>
					</View>
					<View style={productDetailStyles.row}>
						<Text style={productDetailStyles.label}>Fecha de revisión</Text>
						<Text testID="product-detail-date-revision" style={productDetailStyles.value}>
							{new Date(product.date_revision).toLocaleDateString('es-CO')}
						</Text>
					</View>
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
