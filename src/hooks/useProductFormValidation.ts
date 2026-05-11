import { useCallback } from 'react';  
import { useFormValidation, type FormValidationConfig } from './useFormValidation';  
import type { ProductFormData } from '../validators/product.validator';  
import {  
  validateId,  
  validateName,  
  validateDescription,  
  validateLogo,  
  validateDateRelease,  
  validateDateRevision,  
} from '../validators/product.validator';  
import { productsApi } from '../api/products.api';  
  
/**  
 * Hook específico para validaciones en tiempo real del formulario de producto  
 * Implementa la estrategia del plan técnico:  
 * - On Blur: Validar campo individual  
 * - On Submit: Validar todo el form  
 * - Async ID Check: Solo cuando el campo pierde foco y es válido en formato  
 */  
export const useProductFormValidation = (mode: 'create' | 'edit' = 'create') => {  
  const validationConfig: FormValidationConfig<ProductFormData> = {  
    id: {  
      validate: async (value: string) => {  
        // Validación síncrona primero  
        const syncResult = validateId(value);  
        if (!syncResult.isValid) {  
          return syncResult;  
        }  
  
        // Validación asíncrona de existencia (solo en modo create)  
        if (mode === 'create' && value) {  
          try {  
            const exists = await productsApi.verifyProductId(value);  
            if (exists) {  
              return { isValid: false, error: 'Este ID ya existe' };  
            }  
          } catch (error) {  
            // Si falla la verificación, no bloqueamos el formulario  
            console.error('Error verificando ID:', error);  
          }  
        }  
  
        return { isValid: true };  
      },  
      validateOnBlur: true,  
      validateOnChange: false,  
    },  
    name: {  
      validate: (value: string) => validateName(value),  
      validateOnBlur: true,  
      validateOnChange: false,  
    },  
    description: {  
      validate: (value: string) => validateDescription(value),  
      validateOnBlur: true,  
      validateOnChange: false,  
    },  
    logo: {  
      validate: (value: string) => validateLogo(value),  
      validateOnBlur: true,  
      validateOnChange: false,  
    },  
    date_release: {  
      validate: (value: string) => validateDateRelease(value),  
      validateOnBlur: true,  
      validateOnChange: false,  
    },  
    date_revision: {  
      validate: (value: string) => {  
        // Necesitamos el valor de date_release para validar  
        // Esto se maneja en el componente principal  
        return validateDateRevision(value, ''); // Se actualiza dinámicamente  
      },  
      validateOnBlur: true,  
      validateOnChange: false,  
    },  
  };  
  
  const initialValues: ProductFormData = {  
    id: '',  
    name: '',  
    description: '',  
    logo: '',  
    date_release: '',  
    date_revision: '',  
  };  
  
  return useFormValidation<ProductFormData>(initialValues, validationConfig);  
};