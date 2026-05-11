import { renderHook, act, waitFor } from '@testing-library/react-native';  
import { useFormValidation, type FormValidationConfig } from './useFormValidation';  
  
describe('useFormValidation', () => {  
  interface TestFormData {  
    email: string;  
    password: string;  
    age: number;  
  }  
  
  const initialValues: TestFormData = {  
    email: '',  
    password: '',  
    age: 0,  
  };  
  
  const validationConfig: FormValidationConfig<TestFormData> = {  
    email: {  
      validate: (value: string) => {  
        if (!value) return { isValid: false, error: 'Email requerido' };  
        if (!value.includes('@')) return { isValid: false, error: 'Email inválido' };  
        return { isValid: true };  
      },  
      validateOnBlur: true,  
    },  
    password: {  
      validate: (value: string) => {  
        if (!value) return { isValid: false, error: 'Password requerido' };  
        if (value.length < 6) return { isValid: false, error: 'Password muy corto' };  
        return { isValid: true };  
      },  
      validateOnBlur: true,  
    },  
    age: {  
      validate: (value: number) => {  
        if (value < 18) return { isValid: false, error: 'Debe ser mayor de edad' };  
        return { isValid: true };  
      },  
      validateOnBlur: true,  
    },  
  };  
  
  it('initializes with default values', () => {  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, validationConfig)  
    );  
  
    expect(result.current.values).toEqual(initialValues);  
    expect(result.current.errors).toEqual({});  
    expect(result.current.touched).toEqual({});  
    expect(result.current.isValidating).toBe(false);  
  });  
  
  it('updates value on handleChange', () => {  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, validationConfig)  
    );  
  
    act(() => {  
      result.current.handleChange('email', 'test@example.com');  
    });  
  
    expect(result.current.values.email).toBe('test@example.com');  
  });  
  
  it('clears error when user starts typing', () => {  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, validationConfig)  
    );  
  
    // Primero establecer un error  
    act(() => {  
      result.current.setFieldValue('email', '');  
      result.current.handleBlur('email');  
    });  
  
    expect(result.current.errors.email).toBe('Email requerido');  
  
    // Luego cambiar el valor  
    act(() => {  
      result.current.handleChange('email', 'test');  
    });  
  
    expect(result.current.errors.email).toBeUndefined();  
  });  
  
  it('validates field on blur', async () => {  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, validationConfig)  
    );  
  
    act(() => {  
      result.current.setFieldValue('email', 'invalid-email');  
    });  
  
    await act(async () => {  
      await result.current.handleBlur('email');  
    });  
  
    expect(result.current.errors.email).toBe('Email inválido');  
    expect(result.current.touched.email).toBe(true);  
  });  
  
  it('validates all fields on validateAll', async () => {  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, validationConfig)  
    );  
  
    act(() => {  
      result.current.setFieldValue('email', 'invalid');  
      result.current.setFieldValue('password', 'short');  
      result.current.setFieldValue('age', 15);  
    });  
  
    let isValid = false;  
    await act(async () => {  
      isValid = await result.current.validateAll();  
    });  
  
    expect(isValid).toBe(false);  
    expect(result.current.errors.email).toBe('Email inválido');  
    expect(result.current.errors.password).toBe('Password muy corto');  
    expect(result.current.errors.age).toBe('Debe ser mayor de edad');  
  });  
  
  it('returns true when all fields are valid', async () => {  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, validationConfig)  
    );  
  
    act(() => {  
      result.current.setFieldValue('email', 'test@example.com');  
      result.current.setFieldValue('password', 'password123');  
      result.current.setFieldValue('age', 25);  
    });  
  
    let isValid = false;  
    await act(async () => {  
      isValid = await result.current.validateAll();  
    });  
  
    expect(isValid).toBe(true);  
    expect(Object.keys(result.current.errors)).toHaveLength(0);  
  });  
  
  it('resets single field', () => {  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, validationConfig)  
    );  
  
    act(() => {  
      result.current.setFieldValue('email', 'test@example.com');  
      result.current.handleBlur('email');  
    });  
  
    act(() => {  
      result.current.resetField('email');  
    });  
  
    expect(result.current.values.email).toBe('');  
    expect(result.current.errors.email).toBeUndefined();  
    expect(result.current.touched.email).toBe(false);  
  });  
  
  it('resets entire form', () => {  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, validationConfig)  
    );  
  
    act(() => {  
      result.current.setFieldValue('email', 'test@example.com');  
      result.current.setFieldValue('password', 'password123');  
      result.current.handleBlur('email');  
      result.current.handleBlur('password');  
    });  
  
    act(() => {  
      result.current.resetForm();  
    });  
  
    expect(result.current.values).toEqual(initialValues);  
    expect(result.current.errors).toEqual({});  
    expect(result.current.touched).toEqual({});  
  });  
  
  it('handles async validation', async () => {  
    const asyncValidationConfig: FormValidationConfig<TestFormData> = {  
      email: {  
        validate: async (value: string) => {  
          await new Promise((resolve) => setTimeout(resolve, 100));  
          if (value === 'taken@example.com') {  
            return { isValid: false, error: 'Email ya existe' };  
          }  
          return { isValid: true };  
        },  
        validateOnBlur: true,  
      },  
    };  
  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, asyncValidationConfig)  
    );  
  
    act(() => {  
      result.current.setFieldValue('email', 'taken@example.com');  
    });  
  
    expect(result.current.isValidating).toBe(false);  
  
    await act(async () => {  
      await result.current.handleBlur('email');  
    });  
  
    expect(result.current.isValidating).toBe(false);  
    expect(result.current.errors.email).toBe('Email ya existe');  
  });  
  
  it('sets isValidating during async validation', async () => {  
    const asyncValidationConfig: FormValidationConfig<TestFormData> = {  
      email: {  
        validate: async (value: string) => {  
          await new Promise((resolve) => setTimeout(resolve, 100));  
          return { isValid: true };  
        },  
        validateOnBlur: true,  
      },  
    };  
  
    const { result } = renderHook(() =>  
      useFormValidation(initialValues, asyncValidationConfig)  
    );  
  
    act(() => {  
      result.current.setFieldValue('email', 'test@example.com');  
    });  
  
    act(() => {  
      result.current.handleBlur('email');  
    });  
  
    expect(result.current.isValidating).toBe(true);  
  
    await waitFor(() => {  
      expect(result.current.isValidating).toBe(false);  
    });  
  });  
});