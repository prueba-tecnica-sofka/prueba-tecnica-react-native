import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import theme from '../../../theme';
import type { Product } from '../../../types/product.types';

const { colors, spacing, typography } = theme;

interface ProductCardProps {
	product: Product;
	onPress: () => void;
	testID?: string;
}

function ProductCardComponent({ product, onPress, testID }: ProductCardProps): React.JSX.Element {
	return (
		<TouchableOpacity
			accessibilityLabel={`Ver detalle del producto ${product.name} con id ${product.id}`}
			accessibilityRole="button"
			activeOpacity={0.8}
			onPress={onPress}
			style={styles.container}
			testID={testID}
		>
			<Image
				source={{ uri: product.logo }}
				style={styles.logo}
				resizeMode="cover"
				accessibilityLabel={`Logo del producto ${product.name}`}
			/>

			<View style={styles.content}>
				<Text style={styles.name}>{product.name}</Text>
				<Text numberOfLines={2} ellipsizeMode="tail" style={styles.description}>
					{product.description}
				</Text>
				<Text style={styles.id}>ID: {product.id}</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: colors.white,
		borderColor: colors.borderLight,
		borderRadius: spacing.borderRadius.lg,
		borderWidth: 1,
		flexDirection: 'row',
		padding: spacing.lg,
	},
	content: {
		flex: 1,
		marginLeft: spacing.md,
	},
	description: {
		color: colors.textSecondary,
		fontSize: typography.fontSize.base,
		marginTop: spacing.xs,
	},
	id: {
		color: colors.textLight,
		fontSize: typography.fontSize.sm,
		marginTop: spacing.sm,
	},
	logo: {
		backgroundColor: colors.gray100,
		borderRadius: spacing.borderRadius.md,
		height: 56,
		width: 56,
	},
	name: {
		color: colors.text,
		fontSize: typography.fontSize.md,
		fontWeight: typography.fontWeight.bold,
	},
});

export const ProductCard = memo(ProductCardComponent);

ProductCard.displayName = 'ProductCard';
