import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';

import { LoadingSpinner } from '../../common/LoadingSpinner/LoadingSpinner';
import { ProductCard } from '../ProductCard/ProductCard';
import type { Product, ProductListProps } from '../../../types/product.types';
import { productListStyles } from './ProductList.styles';

function ProductListComponent({
	products,
	onProductPress,
	testID,
	isLoading = false,
}: ProductListProps): React.JSX.Element {
	if (isLoading) {
		return (
			<View style={productListStyles.loadingContainer} testID={testID}>
				<LoadingSpinner testID={`${testID}-loading`} />
			</View>
		);
	}

	return (
		<FlatList<Product>
			data={products}
			keyExtractor={(item) => item.id}
			ListEmptyComponent={() => (
				<View style={productListStyles.emptyContainer} testID={`${testID}-empty`}>
					<Text style={productListStyles.emptyText}>No hay productos para mostrar</Text>
				</View>
			)}
			contentContainerStyle={productListStyles.contentContainer}
			ItemSeparatorComponent={() => <View style={productListStyles.separator} />}
			renderItem={({ item }) => (
				<ProductCard
					product={item}
					onPress={() => onProductPress(item.id)}
					testID={`product-card-${item.id}`}
				/>
			)}
			style={productListStyles.container}
			testID={testID}
		/>
	);
}

const ProductList = memo(ProductListComponent);
export default ProductList;

