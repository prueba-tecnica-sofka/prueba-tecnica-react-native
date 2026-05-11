import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import type { Product } from '../../../types/product.types';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
	const mockOnPress = jest.fn();

	const product: Product = {
		id: 'trj-crd-001',
		name: 'Tarjeta de Credito Oro',
		description: 'Tarjeta para compras internacionales y beneficios exclusivos.',
		logo: 'https://example.com/logo.png',
		date_release: '2026-05-11',
		date_revision: '2027-05-11',
	};

	beforeEach(() => {
		mockOnPress.mockClear();
	});

	it('renders basic card structure', () => {
		const { getByText } = render(<ProductCard product={product} onPress={mockOnPress} />);

		expect(getByText(product.name)).toBeTruthy();
		expect(getByText(product.description)).toBeTruthy();
		expect(getByText(`ID: ${product.id}`)).toBeTruthy();
	});

	it('renders product data from props', () => {
		const customProduct: Product = {
			...product,
			id: 'sv-acc-202',
			name: 'Cuenta de Ahorros Plus',
			description: 'Cuenta con rendimiento mensual y retiros sin costo.',
		};

		const { getByText, getByLabelText } = render(
			<ProductCard product={customProduct} onPress={mockOnPress} />
		);

		expect(getByText(customProduct.name)).toBeTruthy();
		expect(getByText(customProduct.description)).toBeTruthy();
		expect(getByText(`ID: ${customProduct.id}`)).toBeTruthy();
		expect(getByLabelText(`Logo del producto ${customProduct.name}`)).toBeTruthy();
	});

	it('calls onPress callback when card is pressed', () => {
		const { getByLabelText } = render(<ProductCard product={product} onPress={mockOnPress} />);

		fireEvent.press(getByLabelText(`Ver detalle del producto ${product.name} con id ${product.id}`));

		expect(mockOnPress).toHaveBeenCalledTimes(1);
	});

	it('uses provided testID on the touchable container', () => {
		const { getByTestId } = render(
			<ProductCard product={product} onPress={mockOnPress} testID="product-card" />
		);

		expect(getByTestId('product-card')).toBeTruthy();
	});
});
