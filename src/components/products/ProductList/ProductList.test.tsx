import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import type { Product } from '../../../types/product.types';
import ProductList from './ProductList';

describe('ProductList', () => {
	const mockOnProductPress = jest.fn();

	const products: Product[] = [
		{
			id: 'prod-001',
			name: 'Cuenta de Ahorros Plus',
			description: 'Cuenta con rendimiento mensual y retiros sin costo.',
			logo: 'https://example.com/savings.png',
			date_release: '2026-05-11',
			date_revision: '2027-05-11',
		},
		{
			id: 'prod-002',
			name: 'Tarjeta Visa Oro',
			description: 'Tarjeta con beneficios para compras internacionales.',
			logo: 'https://example.com/card.png',
			date_release: '2026-05-11',
			date_revision: '2027-05-11',
		},
	];

	beforeEach(() => {
		mockOnProductPress.mockClear();
	});

	it('renders the list of products', () => {
		const { getByTestId, getByText } = render(
			<ProductList products={products} onProductPress={mockOnProductPress} testID="product-list" />,
		);

		expect(getByTestId('product-list')).toBeTruthy();
		expect(getByText(products[0].name)).toBeTruthy();
		expect(getByText(products[1].name)).toBeTruthy();
		expect(getByTestId(`product-card-${products[0].id}`)).toBeTruthy();
		expect(getByTestId(`product-card-${products[1].id}`)).toBeTruthy();
	});

	it('calls onProductPress when a product is tapped', () => {
		const { getByLabelText } = render(
			<ProductList products={products} onProductPress={mockOnProductPress} testID="product-list" />,
		);

		fireEvent.press(
			getByLabelText(`Ver detalle del producto ${products[0].name} con id ${products[0].id}`),
		);

		expect(mockOnProductPress).toHaveBeenCalledTimes(1);
		expect(mockOnProductPress).toHaveBeenCalledWith(products[0].id);
	});

	it('shows an empty state when there are no products', () => {
		const { getByTestId, getByText, queryByTestId } = render(
			<ProductList products={[]} onProductPress={mockOnProductPress} testID="product-list" />,
		);

		expect(getByTestId('product-list-empty')).toBeTruthy();
		expect(getByText('No hay productos para mostrar')).toBeTruthy();
		expect(queryByTestId('product-card-prod-001')).toBeNull();
	});

	it('shows loading state when isLoading is true', () => {
		const { getByTestId, queryByTestId, queryByText } = render(
			<ProductList
				products={products}
				onProductPress={mockOnProductPress}
				testID="product-list"
				isLoading
			/>,
		);

		expect(getByTestId('product-list')).toBeTruthy();
		expect(getByTestId('product-list-loading')).toBeTruthy();
		expect(queryByTestId('product-card-prod-001')).toBeNull();
		expect(queryByText(products[0].name)).toBeNull();
	});
});