import { renderHook, waitFor } from '@testing-library/react-native';
import { useProductForm } from './useProductForm';
import type { RootStackParamList } from '../navigation/types';

const mockGoBack = jest.fn();

let mockRouteParams: RootStackParamList['ProductForm'] = { mode: 'create' };

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');

  return {
    ...actual,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
    useRoute: () => ({
      params: mockRouteParams,
    }),
  };
});

jest.mock('../api/products.api', () => ({
  productsApi: {
    getProductById: jest.fn(),
    verifyProductId: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
  },
}));

import { productsApi } from '../api/products.api';

const mockedProductsApi = productsApi as jest.Mocked<typeof productsApi>;

describe('useProductForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = { mode: 'create' };
  });

  it('keeps an empty form in create mode without loading products', () => {
    const { result } = renderHook(() => useProductForm());

    expect(result.current.mode).toBe('create');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.formData).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
    expect(mockedProductsApi.getProductById).not.toHaveBeenCalled();
  });

  it('preloads the selected product in edit mode', async () => {
    mockedProductsApi.getProductById.mockResolvedValue({
      id: 'abc-123',
      name: 'Producto a editar',
      description: 'Descripcion del producto a editar',
      logo: 'https://example.com/logo.png',
      date_release: '2026-05-12',
      date_revision: '2027-05-12',
    });

    mockRouteParams = { mode: 'edit', productId: 'abc-123' };

    const { result } = renderHook(() => useProductForm());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedProductsApi.getProductById).toHaveBeenCalledWith('abc-123');
    expect(result.current.mode).toBe('edit');
    expect(result.current.formData).toEqual({
      id: 'abc-123',
      name: 'Producto a editar',
      description: 'Descripcion del producto a editar',
      logo: 'https://example.com/logo.png',
      date_release: '2026-05-12',
      date_revision: '2027-05-12',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isFieldDisabled('id')).toBe(true);
  });

  it('shows an error when the edit product is not found', async () => {
    mockedProductsApi.getProductById.mockRejectedValue(new Error('No se encontró el producto a editar'));

    mockRouteParams = { mode: 'edit', productId: 'missing-id' };

    const { result } = renderHook(() => useProductForm());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errors._form).toBe('No se encontró el producto a editar');
    expect(result.current.formData).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
  });
});