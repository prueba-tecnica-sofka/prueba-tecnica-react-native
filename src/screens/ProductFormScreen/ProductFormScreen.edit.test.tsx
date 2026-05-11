import React from 'react';  
import { render, fireEvent, waitFor } from '@testing-library/react-native';  
import { NavigationContainer } from '@react-navigation/native';  
import { createNativeStackNavigator } from '@react-navigation/native-stack';  
import { ProductFormScreen } from './ProductFormScreen';  
import type { RootStackParamList } from '../../navigation/types';  
  
// Mock del hook  
jest.mock('../../hooks/useProductForm', () => ({  
  useProductForm: jest.fn(),  
}));  
  
// Mock de la API  
jest.mock('../../api/products.api', () => ({  
  productsApi: {  
    verifyProductId: jest.fn(),  
    createProduct: jest.fn(),  
    updateProduct: jest.fn(),  
    getProductById: jest.fn(),  
  },  
}));  
  
import { useProductForm } from '../../hooks/useProductForm';  
import { productsApi } from '../../api/products.api';  
  
const Stack = createNativeStackNavigator<RootStackParamList>();  
  
const mockUseProductForm = useProductForm as jest.MockedFunction<typeof useProductForm>;  

const isDisabled = (props: Record<string, unknown>): boolean => {
  return Boolean(
    props.disabled ||
      (props.accessibilityState as { disabled?: boolean } | undefined)?.disabled ||
      props.editable === false
  );
};
  
describe('ProductFormScreen - Edit Mode', () => {  
  const mockNavigate = jest.fn();  
  const mockGoBack = jest.fn();  
  
  const editModeProps = {  
    formData: {  
      id: 'existing-id',  
      name: 'Producto Existente',  
      description: 'Descripción del producto existente',  
      logo: 'https://example.com/logo.png',  
      date_release: '2024-01-01',  
      date_revision: '2025-01-01',  
    },  
    errors: {},  
    isLoading: false,  
    isSubmitting: false,  
    isIdChecking: false,  
    mode: 'edit' as const,  
    handleChange: jest.fn(),  
    handleBlur: jest.fn(),  
    handleSubmit: jest.fn(),  
    isFieldDisabled: jest.fn((field) => field === 'id'),  
  };  
  
  beforeEach(() => {  
    jest.clearAllMocks();  
    mockUseProductForm.mockReturnValue({  
      ...editModeProps,  
      // @ts-ignore  
      navigation: { goBack: mockGoBack },  
    });  
  });  
  
  const renderWithNavigation = () => {  
    return render(  
      <NavigationContainer>  
        <Stack.Navigator>  
          <Stack.Screen  
            name="ProductForm"  
            component={ProductFormScreen}  
            initialParams={{ mode: 'edit', productId: 'existing-id' }}  
          />  
        </Stack.Navigator>  
      </NavigationContainer>  
    );  
  };  
  
  it('renders correctly in edit mode', () => {  
    const { getByText } = renderWithNavigation();  
    expect(getByText('Editar Producto')).toBeTruthy();  
  });  
  
  it('pre-loads product data in edit mode', () => {  
    const { getByTestId } = renderWithNavigation();  
      
    expect(getByTestId('input-id-input').props.value).toBe('existing-id');  
    expect(getByTestId('input-name-input').props.value).toBe('Producto Existente');  
    expect(getByTestId('input-description-input').props.value).toBe('Descripción del producto existente');  
  });  
  
  it('disables ID field in edit mode', () => {  
    const { getByTestId } = renderWithNavigation();  
      
    const idInput = getByTestId('input-id-input');  
    expect(isDisabled(idInput.props as Record<string, unknown>)).toBe(true);
  });  
  
  it('does not show ID checking text in edit mode', () => {  
    const { queryByText } = renderWithNavigation();  
    expect(queryByText('Verificando ID...')).toBeNull();  
  });  
  
  it('shows "Guardar Cambios" button in edit mode', () => {  
    const { getByText } = renderWithNavigation();  
    expect(getByText('Guardar Cambios')).toBeTruthy();  
  });  
  
  it('does not verify ID on blur in edit mode', () => {  
    const { getByTestId } = renderWithNavigation();  
      
    const idInput = getByTestId('input-id-input');  
    fireEvent(idInput, 'blur');  
      
    expect(editModeProps.handleBlur).not.toHaveBeenCalled();
    expect(productsApi.verifyProductId).not.toHaveBeenCalled();  
  });  
  
  it('calls updateProduct on submit in edit mode', async () => {  
    const { getByTestId } = renderWithNavigation();  
      
    const submitButton = getByTestId('submit-button');  
    fireEvent.press(submitButton);  
      
    await waitFor(() => {  
      expect(editModeProps.handleSubmit).toHaveBeenCalled();  
    });  
  });  
  
  it('shows loading state when pre-loading data', () => {  
    mockUseProductForm.mockReturnValue({  
      ...editModeProps,  
      isLoading: true,  
    });  
  
    const { getByText } = renderWithNavigation();  
    expect(getByText('Cargando producto...')).toBeTruthy();  
  });  
  
  it('allows editing date_revision in edit mode', () => {
    const { getByTestId } = renderWithNavigation();  
      
    const revisionInput = getByTestId('input-date-revision-button');  
    expect(isDisabled(revisionInput.props as Record<string, unknown>)).toBe(false);
  });  
  
  it('does not show auto-calculated text in edit mode', () => {  
    const { queryByText } = renderWithNavigation();  
    expect(queryByText('✓ Calculado automáticamente (+1 año)')).toBeNull();  
  });  
});