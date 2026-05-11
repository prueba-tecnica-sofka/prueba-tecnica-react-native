import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { productsApi } from '../../api/products.api';
import type { Product, ProductInput } from '../../api/types';
import { ErrorMessages } from '../../utils/error.messages';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  setSearchTerm,
  updateProduct,
  verifyProductId,
} from './products.actions';

type ProductsStateShape = {
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
};

jest.mock('../../api/products.api', () => ({
  productsApi: {
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    verifyProductId: jest.fn(),
  },
}));

const mockedProductsApi = productsApi as jest.Mocked<typeof productsApi>;

const baseProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Cuenta Ahorros',
    description: 'Producto de ahorro para clientes nuevos',
    logo: 'https://bank.test/logo-1.png',
    date_release: '2026-05-11',
    date_revision: '2027-05-11',
  },
  {
    id: 'prod-2',
    name: 'Tarjeta Gold',
    description: 'Tarjeta premium para compras internacionales',
    logo: 'https://bank.test/logo-2.png',
    date_release: '2026-05-11',
    date_revision: '2027-05-11',
  },
];

describe('products.actions', () => {
  let state: ProductsStateShape;

  const get = () => state;
  const set = (nextState: Partial<ProductsStateShape>) => {
    state = { ...state, ...nextState };
  };

  beforeEach(() => {
    state = {
      products: [...baseProducts],
      filteredProducts: [...baseProducts],
      searchTerm: '',
      isLoading: false,
      error: null,
    };

    jest.clearAllMocks();
  });

  it('fetchProducts carga productos y respeta el filtro actual', async () => {
    state.searchTerm = 'gold';
    mockedProductsApi.getProducts.mockResolvedValue(baseProducts);

    await fetchProducts(set as never, get as never);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.products).toEqual(baseProducts);
    expect(state.filteredProducts).toHaveLength(1);
    expect(state.filteredProducts[0]?.id).toBe('prod-2');
  });

  it('fetchProducts asigna fallback de error desconocido', async () => {
    mockedProductsApi.getProducts.mockRejectedValue({});

    await fetchProducts(set as never, get as never);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(ErrorMessages.UNKNOWN_ERROR);
  });

  it('createProduct agrega producto y aplica filtro', async () => {
    const input: ProductInput = {
      id: 'prod-3',
      name: 'Credito Vivienda',
      description: 'Credito hipotecario para vivienda nueva',
      logo: 'https://bank.test/logo-3.png',
      date_release: '2026-05-11',
      date_revision: '2027-05-11',
    };

    state.searchTerm = 'vivienda';
    mockedProductsApi.createProduct.mockResolvedValue(input);

    await createProduct(set as never, get as never, input);

    expect(state.products).toHaveLength(3);
    expect(state.filteredProducts).toEqual([input]);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('createProduct propaga error y setea mensaje de creacion', async () => {
    const input: ProductInput = {
      id: 'prod-4',
      name: 'Producto X',
      description: 'Descripcion valida para probar errores',
      logo: 'https://bank.test/logo-4.png',
      date_release: '2026-05-11',
      date_revision: '2027-05-11',
    };

    const apiError = new Error('fallo en API');
    mockedProductsApi.createProduct.mockRejectedValue(apiError);

    await expect(createProduct(set as never, get as never, input)).rejects.toThrow('fallo en API');
    expect(state.error).toBe('fallo en API');
    expect(state.isLoading).toBe(false);
  });

  it('updateProduct reemplaza el producto correcto', async () => {
    const updatedProduct: Product = {
      ...baseProducts[0],
      name: 'Cuenta Ahorros Plus',
    };

    mockedProductsApi.updateProduct.mockResolvedValue(updatedProduct);

    await updateProduct(set as never, get as never, 'prod-1', updatedProduct);

    expect(state.products[0]?.name).toBe('Cuenta Ahorros Plus');
    expect(state.products[1]?.name).toBe('Tarjeta Gold');
    expect(state.error).toBeNull();
  });

  it('deleteProduct elimina por id', async () => {
    mockedProductsApi.deleteProduct.mockResolvedValue(undefined);

    await deleteProduct(set as never, get as never, 'prod-2');

    expect(state.products).toHaveLength(1);
    expect(state.products[0]?.id).toBe('prod-1');
    expect(state.filteredProducts).toHaveLength(1);
  });

  it('updateProduct propaga error y usa mensaje de fallback', async () => {
    const apiError = new Error('update fallo');
    mockedProductsApi.updateProduct.mockRejectedValue(apiError);

    await expect(
      updateProduct(set as never, get as never, 'prod-1', baseProducts[0] as ProductInput)
    ).rejects.toThrow('update fallo');

    expect(state.error).toBe('update fallo');
    expect(state.isLoading).toBe(false);
  });

  it('deleteProduct propaga error y usa mensaje de fallback', async () => {
    const apiError = new Error('delete fallo');
    mockedProductsApi.deleteProduct.mockRejectedValue(apiError);

    await expect(deleteProduct(set as never, get as never, 'prod-1')).rejects.toThrow('delete fallo');

    expect(state.error).toBe('delete fallo');
    expect(state.isLoading).toBe(false);
  });

  it('setSearchTerm filtra por id, nombre y descripcion ignorando mayusculas', () => {
    setSearchTerm(set as never, get as never, '  TARJETA  ');
    expect(state.filteredProducts).toHaveLength(1);
    expect(state.filteredProducts[0]?.id).toBe('prod-2');

    setSearchTerm(set as never, get as never, 'prod-1');
    expect(state.filteredProducts).toHaveLength(1);
    expect(state.filteredProducts[0]?.name).toBe('Cuenta Ahorros');

    setSearchTerm(set as never, get as never, '');
    expect(state.filteredProducts).toHaveLength(2);
  });

  it('verifyProductId invierte respuesta de API y maneja errores', async () => {
    mockedProductsApi.verifyProductId.mockResolvedValue(true);
    await expect(verifyProductId('prod-1')).resolves.toBe(false);

    mockedProductsApi.verifyProductId.mockResolvedValue(false);
    await expect(verifyProductId('prod-9')).resolves.toBe(true);

    mockedProductsApi.verifyProductId.mockRejectedValue(new Error('fallo'));
    await expect(verifyProductId('prod-10')).resolves.toBe(false);
  });
});
