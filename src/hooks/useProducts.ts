import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { productsApi } from '../api/products.api';
import type { Product } from '../api/types';

interface UseProductsReturn {
	products: Product[];
	filteredProducts: Product[];
	searchTerm: string;
	isLoading: boolean;
	error: string | null;
	setSearchTerm: (term: string) => void;
	refreshProducts: () => Promise<void>;
}

const filterProducts = (products: Product[], term: string): Product[] => {
	const normalizedTerm = term.trim().toLowerCase();

	if (!normalizedTerm) {
		return products;
	}

	return products.filter((product) => {
		return (
			product.name.toLowerCase().includes(normalizedTerm) ||
			product.id.toLowerCase().includes(normalizedTerm) ||
			product.description.toLowerCase().includes(normalizedTerm)
		);
	});
};

export const useProducts = (): UseProductsReturn => {
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refreshProducts = useCallback(async (): Promise<void> => {
		try {
			setIsLoading(true);
			setError(null);

			const apiProducts = await productsApi.getProducts();
			setProducts(apiProducts);
		} catch (fetchError) {
			const message =
				fetchError instanceof Error ? fetchError.message : 'Error al cargar productos';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			void refreshProducts();
		}, [refreshProducts]),
	);

	useEffect(() => {
		setFilteredProducts(filterProducts(products, searchTerm));
	}, [products, searchTerm]);

	return {
		products,
		filteredProducts,
		searchTerm,
		isLoading,
		error,
		setSearchTerm,
		refreshProducts,
	};
};
