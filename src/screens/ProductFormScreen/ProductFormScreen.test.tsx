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
  },  
}));  
  
import { useProductForm } from '../../hooks/useProductForm';  
import { productsApi } from '../../api/products.api';  
  
const Stack = createNativeStackNavigator<RootStackParamList>();  
  
const mockUseProductForm = useProductForm as jest.MockedFunction<typeof useProductForm>;  

const isDisabled = (props: Record<string, unknown>): boolean => {
  return Boolean(
    props.disabled ||
      (props.accessibilityState as { disabled?: boolean } | undefined)?.disabled
  );
};
  
describe('ProductFormScreen', () => {  
  const mockNavigate = jest.fn();  
  const mockGoBack = jest.fn();  
  
  const defaultProps = {  
    formData: {  
      id: '',  
      name: '',  
      description: '',  
      logo: '',  
      date_release: '',  
      date_revision: '',  
    },  
    errors: {},  
    isLoading: false,  
    isSubmitting: false,  
    isIdChecking: false,  
    mode: 'create' as const,  
    handleChange: jest.fn(),  
    handleBlur: jest.fn(),  
    handleSubmit: jest.fn(),  
    isFieldDisabled: jest.fn(() => false),  
  };  
  
  beforeEach(() => {  
    jest.clearAllMocks();  
    mockUseProductForm.mockReturnValue({  
      ...defaultProps,  
      // @ts-ignore  
      navigation: { goBack: mockGoBack },  
    });  
  });  
  
  const renderWithNavigation = (mode: 'create' | 'edit' = 'create') => {  
    return render(  
      <NavigationContainer>  
        <Stack.Navigator>  
          <Stack.Screen  
            name="ProductForm"  
            component={ProductFormScreen}  
            initialParams={{ mode, productId: mode === 'edit' ? 'test-id' : undefined }}  
          />  
        </Stack.Navigator>  
      </NavigationContainer>  
    );  
  };  
  
  it('renders correctly in create mode', () => {  
    const { getByText } = renderWithNavigation('create');  
    expect(getByText('Nuevo Producto')).toBeTruthy();  
  });  
  
  it('renders correctly in edit mode', () => {  
    mockUseProductForm.mockReturnValue({  
      ...defaultProps,  
      mode: 'edit' as const,  
    });  
    const { getByText } = renderWithNavigation('edit');  
    expect(getByText('Editar Producto')).toBeTruthy();  
  });  

  it('shows preloading state while loading edit product', () => {
    mockUseProductForm.mockReturnValue({
      ...defaultProps,
      mode: 'edit' as const,
      isLoading: true,
    });

    const { getByTestId, getByText } = renderWithNavigation('edit');

    expect(getByTestId('product-form-loading')).toBeTruthy();
    expect(getByText('Cargando producto...')).toBeTruthy();
  });
  
  it('renders all form fields', () => {  
    const { getByTestId } = renderWithNavigation();  
      
    expect(getByTestId('input-id')).toBeTruthy();  
    expect(getByTestId('input-name')).toBeTruthy();  
    expect(getByTestId('input-description')).toBeTruthy();  
    expect(getByTestId('input-logo')).toBeTruthy();  
    expect(getByTestId('input-date-release')).toBeTruthy();  
    expect(getByTestId('input-date-revision')).toBeTruthy();  
  });  
  
  it('calls handleChange when input text changes', () => {  
    const { getByTestId } = renderWithNavigation();  
      
    const idInput = getByTestId('input-id-input');  
    fireEvent.changeText(idInput, 'test-id');  
      
    expect(defaultProps.handleChange).toHaveBeenCalledWith('id', 'test-id');  
  });  
  
  it('calls handleBlur when input loses focus', () => {  
    const { getByTestId } = renderWithNavigation();  
      
    const idInput = getByTestId('input-id-input');  
    fireEvent(idInput, 'blur');  
      
    expect(defaultProps.handleBlur).toHaveBeenCalledWith('id');  
  });  
  
  it('displays field errors', () => {  
    mockUseProductForm.mockReturnValue({  
      ...defaultProps,  
      errors: {  
        id: 'ID inválido',  
        name: 'Nombre muy corto',  
      },  
    });  
  
    const { getByText } = renderWithNavigation();  
      
    expect(getByText('ID inválido')).toBeTruthy();  
    expect(getByText('Nombre muy corto')).toBeTruthy();  
  });  
  
  it('shows checking text when ID is being verified', () => {  
    mockUseProductForm.mockReturnValue({  
      ...defaultProps,  
      isIdChecking: true,  
    });  
  
    const { getByText } = renderWithNavigation();  
    expect(getByText('Verificando ID...')).toBeTruthy();  
  });  
  
  it('calls handleSubmit when submit button is pressed', () => {  
    const { getByTestId } = renderWithNavigation();  
      
    const submitButton = getByTestId('submit-button');  
    fireEvent.press(submitButton);  
      
    expect(defaultProps.handleSubmit).toHaveBeenCalled();  
  });  
  
  it('disables submit button when submitting', () => {  
    mockUseProductForm.mockReturnValue({  
      ...defaultProps,  
      isSubmitting: true,  
    });  
  
    const { getByTestId } = renderWithNavigation();  
    const submitButton = getByTestId('submit-button');  
      
      expect(isDisabled(submitButton.props)).toBe(true);  
  });  
  
  it('disables submit button when ID is checking', () => {  
    mockUseProductForm.mockReturnValue({  
      ...defaultProps,  
      isIdChecking: true,  
    });  
  
    const { getByTestId } = renderWithNavigation();  
    const submitButton = getByTestId('submit-button');  
      
      expect(isDisabled(submitButton.props)).toBe(true);  
  });  
  
  it('displays form error when present', () => {  
    mockUseProductForm.mockReturnValue({  
      ...defaultProps,  
      errors: {  
        _form: 'Error al guardar',  
      },  
    });  
  
    const { getByTestId } = renderWithNavigation();  
    expect(getByTestId('form-error')).toBeTruthy();  
  });  
});