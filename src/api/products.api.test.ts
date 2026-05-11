import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import apiClient from './client';
import { productsApi } from './products.api';
import type { Product, ProductInput } from './types';

jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

type MockedApiClient = {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
};

const mockedApiClient = apiClient as unknown as MockedApiClient;

describe('productsApi', () => {
  const mockProduct: Product = {
    id: 'trj-crd',
    name: 'Tarjeta de Credito',
    description: 'Tarjeta de consumo bajo modalidad de credito',
    logo: 'https://example.com/logo.png',
    date_release: '2026-05-01',
    date_revision: '2027-05-01',
  };

  const mockProductInput: ProductInput = {
    id: 'new-id',
    name: 'Nuevo Producto',
    description: 'Descripcion valida del nuevo producto',
    logo: 'https://example.com/new-logo.png',
    date_release: '2026-06-01',
    date_revision: '2027-06-01',
  };

  beforeEach(() => {
    mockedApiClient.get.mockReset();
    mockedApiClient.post.mockReset();
    mockedApiClient.put.mockReset();
    mockedApiClient.delete.mockReset();
  });

  it('getProducts calls the products endpoint and returns data', async () => {
    mockedApiClient.get.mockResolvedValue({ data: [mockProduct] });

    const result = await productsApi.getProducts();

    expect(mockedApiClient.get).toHaveBeenCalledWith('/bp/products');
    expect(result).toEqual([mockProduct]);
  });

  it('createProduct posts payload and returns created product', async () => {
    mockedApiClient.post.mockResolvedValue({ data: mockProduct });

    const result = await productsApi.createProduct(mockProductInput);

    expect(mockedApiClient.post).toHaveBeenCalledWith('/bp/products', mockProductInput);
    expect(result).toEqual(mockProduct);
  });

  it('updateProduct calls the correct endpoint and returns updated product', async () => {
    const updatePayload = { name: 'Producto Editado' };
    const updatedProduct = { ...mockProduct, ...updatePayload };

    mockedApiClient.put.mockResolvedValue({ data: updatedProduct });

    const result = await productsApi.updateProduct(mockProduct.id, updatePayload);

    expect(mockedApiClient.put).toHaveBeenCalledWith(`/bp/products/${mockProduct.id}`, updatePayload);
    expect(result).toEqual(updatedProduct);
  });

  it('deleteProduct calls endpoint with product id', async () => {
    mockedApiClient.delete.mockResolvedValue(undefined);

    await productsApi.deleteProduct(mockProduct.id);

    expect(mockedApiClient.delete).toHaveBeenCalledWith(`/bp/products/${mockProduct.id}`);
  });

  it('verifyProductId returns true when API returns true', async () => {
    mockedApiClient.get.mockResolvedValue(true);

    const result = await productsApi.verifyProductId('existing-id');

    expect(mockedApiClient.get).toHaveBeenCalledWith('/bp/products/verification/existing-id');
    expect(result).toBe(true);
  });

  it('verifyProductId returns false when API throws', async () => {
    mockedApiClient.get.mockRejectedValue(new Error('network fail'));

    const result = await productsApi.verifyProductId('unknown-id');

    expect(result).toBe(false);
  });
});
