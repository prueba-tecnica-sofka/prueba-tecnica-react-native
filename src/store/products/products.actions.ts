import type { StoreApi } from 'zustand';
import { productsApi } from '../../api/products.api';
import type { Product, ProductInput } from '../../api/types';
import { ErrorMessages } from '../../utils/error.messages';
import { getErrorMessage } from '../../utils/error.utils';
import type { ProductsState } from './products.store';

type ProductsSetState = StoreApi<ProductsState>['setState'];
type ProductsGetState = StoreApi<ProductsState>['getState'];

const resolveErrorMessage = (error: unknown, fallback: string): string => {
  const message = getErrorMessage(error);
  return message === 'Error desconocido' ? fallback : message;
};

const filterProducts = (products: Product[], term: string): Product[] => {
  const normalizedTerm = term.trim().toLowerCase();
  if (!normalizedTerm) {
    return products;
  }

  return products.filter((product) => {
    return (
      product.name.toLowerCase().includes(normalizedTerm) ||
      product.description.toLowerCase().includes(normalizedTerm) ||
      product.id.toLowerCase().includes(normalizedTerm)
    );
  });
};

export const fetchProducts = async (
  set: ProductsSetState,
  get: ProductsGetState
): Promise<void> => {
  set({ isLoading: true, error: null });

  try {
    const products = await productsApi.getProducts();

    set({
      products,
      filteredProducts: filterProducts(products, get().searchTerm),
      isLoading: false,
    });
  } catch (error: unknown) {
    set({
      error: resolveErrorMessage(error, ErrorMessages.UNKNOWN_ERROR),
      isLoading: false,
    });
  }
};

export const createProduct = async (
  set: ProductsSetState,
  get: ProductsGetState,
  product: ProductInput
): Promise<void> => {
  set({ isLoading: true, error: null });

  try {
    const createdProduct = await productsApi.createProduct(product);
    const nextProducts = [...get().products, createdProduct];

    set({
      products: nextProducts,
      filteredProducts: filterProducts(nextProducts, get().searchTerm),
      isLoading: false,
    });
  } catch (error: unknown) {
    set({
      error: resolveErrorMessage(error, ErrorMessages.PRODUCT_CREATE_FAILED),
      isLoading: false,
    });
    throw error;
  }
};

export const updateProduct = async (
  set: ProductsSetState,
  get: ProductsGetState,
  id: string,
  product: ProductInput
): Promise<void> => {
  set({ isLoading: true, error: null });

  try {
    const updatedProduct = await productsApi.updateProduct(id, product);
    const nextProducts = get().products.map((currentProduct) =>
      currentProduct.id === id ? updatedProduct : currentProduct
    );

    set({
      products: nextProducts,
      filteredProducts: filterProducts(nextProducts, get().searchTerm),
      isLoading: false,
    });
  } catch (error: unknown) {
    set({
      error: resolveErrorMessage(error, ErrorMessages.PRODUCT_UPDATE_FAILED),
      isLoading: false,
    });
    throw error;
  }
};

export const deleteProduct = async (
  set: ProductsSetState,
  get: ProductsGetState,
  id: string
): Promise<void> => {
  set({ isLoading: true, error: null });

  try {
    await productsApi.deleteProduct(id);

    const nextProducts = get().products.filter((productItem) => productItem.id !== id);
    set({
      products: nextProducts,
      filteredProducts: filterProducts(nextProducts, get().searchTerm),
      isLoading: false,
    });
  } catch (error: unknown) {
    set({
      error: resolveErrorMessage(error, ErrorMessages.PRODUCT_DELETE_FAILED),
      isLoading: false,
    });
    throw error;
  }
};

export const setSearchTerm = (
  set: ProductsSetState,
  get: ProductsGetState,
  term: string
): void => {
  const filteredProducts = filterProducts(get().products, term);
  set({ searchTerm: term, filteredProducts });
};

export const verifyProductId = async (id: string): Promise<boolean> => {
  try {
    const idExists = await productsApi.verifyProductId(id);
    return !idExists;
  } catch {
    return false;
  }
};