import React from 'react';  
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';  
import ProductListScreen from './ProductListScreen';  
import { NavigationContainer } from '@react-navigation/native';  
import { productsApi } from '../../api/products.api';

const mockNavigate = jest.fn() as jest.Mock;

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

jest.mock('../../api/products.api', () => ({
  productsApi: {
    getProducts: jest.fn(),
  },
}));

const mockedProductsApi = productsApi as jest.Mocked<typeof productsApi>;
  
describe('ProductListScreen', () => {  
  const mockProducts = [  
    {  
      id: 'trj-crd',  
      name: 'Tarjetas de Crédito',  
      description: 'Tarjeta de consumo bajo la modalidad de crédito',  
      logo: 'https://example.com/logo.png',  
      date_release: '2023-02-01',  
      date_revision: '2024-02-01',  
    },  
  ];  
  
  beforeEach(() => {  
    jest.clearAllMocks();  
    mockNavigate.mockClear();
  });  
  
  const renderWithNavigation = () => {  
    return render(  
      <NavigationContainer>  
        <ProductListScreen />  
      </NavigationContainer>  
    );  
  };  
  
  it('renders loading state initially', () => {  
    mockedProductsApi.getProducts.mockImplementation(() => new Promise(() => {}));
      
    const { getByText } = renderWithNavigation();  
    expect(getByText('Cargando productos...')).toBeTruthy();  
  });  
  
  it('renders product list after successful fetch', async () => {  
    mockedProductsApi.getProducts.mockResolvedValue(mockProducts);
  
    const { getByText } = renderWithNavigation();  
  
    await waitFor(() => {  
      expect(getByText('Tarjetas de Crédito')).toBeTruthy();  
    });  
  });  
  
  it('displays error message on fetch failure', async () => {  
    mockedProductsApi.getProducts.mockRejectedValue(new Error('Network error'));  
  
    const { getByText } = renderWithNavigation();  
  
    await waitFor(() => {  
      expect(getByText('Network error')).toBeTruthy();  
    });  
  });  

  it('displays API error message when products service fails', async () => {
    mockedProductsApi.getProducts.mockRejectedValue(new Error('Error al cargar productos'));

    const { getByText } = renderWithNavigation();

    await waitFor(() => {
      expect(getByText('Error al cargar productos')).toBeTruthy();
    });
  });
  
  it('filters products by search term', async () => {  
    mockedProductsApi.getProducts.mockResolvedValue(mockProducts);
  
    const { getByTestId, getByText, queryByText } = renderWithNavigation();  
  
    await waitFor(() => {  
      expect(getByText('Tarjetas de Crédito')).toBeTruthy();  
    });  
  
    const searchInput = getByTestId('search-input');  
    fireEvent.changeText(searchInput, 'inexistente');  
  
    await waitFor(() => {  
      expect(queryByText('Tarjetas de Crédito')).toBeNull();  
    });  
  });  
  
  it('shows result count', async () => {  
    mockedProductsApi.getProducts.mockResolvedValue(mockProducts);
  
    const { getByText } = renderWithNavigation();  
  
    await waitFor(() => {  
      expect(getByText('1 resultado')).toBeTruthy();  
    });  
  });  

  it('retries fetch when pressing retry button', async () => {
    mockedProductsApi.getProducts
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockProducts);

    const { getByText } = renderWithNavigation();

    await waitFor(() => {
      expect(getByText('Network error')).toBeTruthy();
    });

    fireEvent.press(getByText('Reintentar'));

    await waitFor(() => {
      expect(getByText('Tarjetas de Crédito')).toBeTruthy();
    });
  });

  it('navigates to product detail when pressing a product card', async () => {
    mockedProductsApi.getProducts.mockResolvedValue(mockProducts);

    const { getByTestId } = renderWithNavigation();

    const productCard = await waitFor(() => getByTestId('product-card-trj-crd'));
    fireEvent.press(productCard);

    expect(mockNavigate).toHaveBeenCalledWith('ProductDetail', {
      productId: 'trj-crd',
    });
  });

  it('navigates to product form when pressing add button', async () => {
    mockedProductsApi.getProducts.mockResolvedValue(mockProducts);

    const { getByTestId } = renderWithNavigation();

    const addButton = await waitFor(() => getByTestId('add-product-button'));
    fireEvent.press(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('ProductForm', {
      mode: 'create',
    });
  });
});