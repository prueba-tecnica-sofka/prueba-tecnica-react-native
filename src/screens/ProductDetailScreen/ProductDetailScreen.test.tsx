import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ProductDetailScreen from './ProductDetailScreen';
import type {
	ProductDetailRouteProp,
	RootStackParamList,
} from '../../navigation/types';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
	const actual = jest.requireActual('@react-navigation/native');
	return {
		...actual,
		useNavigation: () => ({
			navigate: mockNavigate,
		}),
	};
});

describe('ProductDetailScreen', () => {
	const route: ProductDetailRouteProp = {
		key: 'ProductDetail-test',
		name: 'ProductDetail',
		params: {
			productId: 'prod-123',
		},
	};

	const expectedEditParams: RootStackParamList['ProductForm'] = {
		mode: 'edit',
		productId: 'prod-123',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders product information and edit action', () => {
		const { getByText, getByTestId } = render(
			<ProductDetailScreen route={route} />
		);

		expect(getByText('Detalle del Producto')).toBeTruthy();
		expect(getByTestId('product-detail-id')).toHaveTextContent('prod-123');
		expect(getByText('Editar')).toBeTruthy();
		expect(getByTestId('edit-product-button')).toBeTruthy();
	});

	it('navigates to edit form when pressing edit button', () => {
		const { getByTestId } = render(<ProductDetailScreen route={route} />);

		fireEvent.press(getByTestId('edit-product-button'));

		expect(mockNavigate).toHaveBeenCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith('ProductForm', expectedEditParams);
	});
});