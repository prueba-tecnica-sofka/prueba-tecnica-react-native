import { useState, useCallback } from 'react';  
import type { ValidationResult } from '../validators/validation.types';  
  
/**  
 * Configuración de validación para un campo  
 */  
export interface FieldValidationConfig<T> {  
  validate: (value: T) => ValidationResult | Promise<ValidationResult>;  
  validateOnBlur?: boolean;  
  validateOnChange?: boolean;  
  debounceMs?: number;  
}  
  
/**  
 * Configuración de validación para el formulario  
 */  
export type FormValidationConfig<T extends Record<string, any>> = {  
  [K in keyof T]?: FieldValidationConfig<T[K]>;  
};  
  
/**  
 * Resultado del hook useFormValidation  
 */  
export interface UseFormValidationReturn<T extends Record<string, any>> {  
  values: T;  
  errors: Record<keyof T, string>;  
  touched: Record<keyof T, boolean>;  
  isValidating: boolean;  
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;  
  handleBlur: <K extends keyof T>(field: K) => void;  
  validateField: <K extends keyof T>(field: K) => Promise<void>;  
  validateAll: () => Promise<boolean>;  
  resetField: <K extends keyof T>(field: K) => void;  
  resetForm: () => void;  
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;  
}  
  
/**  
 * Hook genérico para validaciones en tiempo real de formularios  
 * Implementa estrategia: On Blur, On Submit, y validaciones asíncronas  
 */  
export function useFormValidation<T extends Record<string, any>>(  
  initialValues: T,  
  validationConfig: FormValidationConfig<T>  
): UseFormValidationReturn<T> {  
  const [values, setValues] = useState<T>(initialValues);  
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);  
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);  
  const [isValidating, setIsValidating] = useState(false);  

  const runFieldValidation = useCallback(
    async <K extends keyof T>(field: K): Promise<ValidationResult | null> => {
      const config = validationConfig[field];
      if (!config) return null;

      return config.validate(values[field]);
    },
    [validationConfig, values]
  );
  
  /**  
   * Maneja el cambio de valor de un campo  
   * Limpia el error del campo cuando el usuario empieza a escribir  
   */  
  const handleChange = useCallback(  
    <K extends keyof T>(field: K, value: T[K]) => {  
      setValues((prev) => ({ ...prev, [field]: value }));  
  
      // Limpiar error del campo cuando el usuario empieza a escribir  
      if (errors[field]) {  
        setErrors((prev) => {  
          const newErrors = { ...prev };  
          delete newErrors[field];  
          return newErrors;  
        });  
      }  
  
      // Validación on change si está configurada  
      const config = validationConfig[field];  
      if (config?.validateOnChange && value !== '') {  
        validateField(field);  
      }  
    },  
    [errors, validationConfig]  
  );  
  
  /**  
   * Maneja el evento blur de un campo  
   * Valida el campo individual (estrategia On Blur)  
   */  
  const handleBlur = useCallback(  
    async <K extends keyof T>(field: K) => {  
      setTouched((prev) => ({ ...prev, [field]: true }));  
  
      const config = validationConfig[field];  
      if (config?.validateOnBlur !== false) {  
        await validateField(field);  
      }  
    },  
    [validationConfig]  
  );  
  
  /**  
   * Valida un campo individual  
   * Soporta validaciones síncronas y asíncronas  
   */  
  const validateField = useCallback(  
    async <K extends keyof T>(field: K) => {  
      setIsValidating(true);  
      try {  
        const result = await runFieldValidation(field);  
        if (!result) return;  
          
        if (!result.isValid && result.error) {  
          setErrors((prev) => ({ ...prev, [field]: result.error }));  
        } else {  
          setErrors((prev) => {  
            const newErrors = { ...prev };  
            delete newErrors[field];  
            return newErrors;  
          });  
        }  
      } catch (error) {  
        console.error(`Error validating field ${String(field)}:`, error);  
      } finally {  
        setIsValidating(false);  
      }  
    },  
    [runFieldValidation]  
  );  
  
  /**  
   * Valida todos los campos del formulario  
   * Usado en On Submit  
   */  
  const validateAll = useCallback(async (): Promise<boolean> => {  
    setIsValidating(true);  
    const nextErrors: Partial<Record<keyof T, string>> = {};  

    const validationPromises = Object.keys(validationConfig).map(async (field) => {  
      const typedField = field as keyof T;  
      const result = await runFieldValidation(typedField);  

      if (result && !result.isValid && result.error) {  
        nextErrors[typedField] = result.error;  
      }  
    });  

    await Promise.all(validationPromises);  

    setErrors(nextErrors as Record<keyof T, string>);  
    setIsValidating(false);  
  
    return Object.keys(nextErrors).length === 0;  
  }, [validationConfig, runFieldValidation]);  
  
  /**  
   * Resetea un campo específico a su valor inicial  
   */  
  const resetField = useCallback(  
    <K extends keyof T>(field: K) => {  
      setValues((prev) => ({ ...prev, [field]: initialValues[field] }));  
      setErrors((prev) => {  
        const newErrors = { ...prev };  
        delete newErrors[field];  
        return newErrors;  
      });  
      setTouched((prev) => ({ ...prev, [field]: false }));  
    },  
    [initialValues]  
  );  
  
  /**  
   * Resetea todo el formulario  
   */  
  const resetForm = useCallback(() => {  
    setValues(initialValues);  
    setErrors({} as Record<keyof T, string>);  
    setTouched({} as Record<keyof T, boolean>);  
  }, [initialValues]);  
  
  /**  
   * Establece directamente el valor de un campo sin disparar validaciones  
   */  
  const setFieldValue = useCallback(  
    <K extends keyof T>(field: K, value: T[K]) => {  
      setValues((prev) => ({ ...prev, [field]: value }));  
    },  
    []  
  );  
  
  return {  
    values,  
    errors,  
    touched,  
    isValidating,  
    handleChange,  
    handleBlur,  
    validateField,  
    validateAll,  
    resetField,  
    resetForm,  
    setFieldValue,  
  };  
}