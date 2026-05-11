import { useState, useCallback, useEffect } from 'react';  
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';  
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';  
import type { RootStackParamList } from '../navigation/types';  
import type { ProductFormData } from '../validators/product.validator';  
import {  
  validateId,  
  validateName,  
  validateDescription,  
  validateLogo,  
  validateDateRelease,  
  validateDateRevision,  
  validateProductForm,  
} from '../validators/product.validator';  
import type { ValidationResult } from '../validators/validation.types';  
import { calculateRevisionDate } from '../utils/date.utils';  
import { productsApi } from '../api/products.api';  
  
type ProductFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductForm'>;  
type ProductFormRouteProp = RouteProp<RootStackParamList, 'ProductForm'>;  
  
interface UseProductFormReturn {  
  formData: ProductFormData;  
  errors: Record<string, string>;  
  isLoading: boolean;  
  isSubmitting: boolean;  
  isIdChecking: boolean;  
  mode: 'create' | 'edit';  
  handleChange: (field: keyof ProductFormData, value: string) => void;  
  handleBlur: (field: keyof ProductFormData) => void;  
  handleSubmit: () => Promise<void>;  
  isFieldDisabled: (field: keyof ProductFormData) => boolean;  
}  
  
export const useProductForm = (): UseProductFormReturn => {  
  const navigation = useNavigation<ProductFormNavigationProp>();  
  const route = useRoute<ProductFormRouteProp>();  
  const { mode, productId } = route.params;  
  
  const [formData, setFormData] = useState<ProductFormData>({  
    id: '',  
    name: '',  
    description: '',  
    logo: '',  
    date_release: '',  
    date_revision: '',  
  });  
  
  const [errors, setErrors] = useState<Record<string, string>>({});  
  const [isLoading, setIsLoading] = useState(mode === 'edit' && Boolean(productId));
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [isIdChecking, setIsIdChecking] = useState(false);  

  useEffect(() => {
    const loadProductForEdit = async (): Promise<void> => {
      if (mode !== 'edit' || !productId) {
        return;
      }

      try {
        const productToEdit = await productsApi.getProductById(productId);

        setFormData({
          id: productToEdit.id,
          name: productToEdit.name,
          description: productToEdit.description,
          logo: productToEdit.logo,
          date_release: productToEdit.date_release,
          date_revision: productToEdit.date_revision,
        });
        setErrors({});
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar el producto';
        setErrors({ _form: errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    void loadProductForEdit();
  }, [mode, productId]);

  const getFieldValidationError = useCallback(
    (field: keyof ProductFormData, data: ProductFormData): string | undefined => {
      let validationResult: ValidationResult;

      switch (field) {
        case 'id':
          validationResult = validateId(data.id);
          return validationResult.isValid ? undefined : validationResult.error;
        case 'name':
          validationResult = validateName(data.name);
          return validationResult.isValid ? undefined : validationResult.error;
        case 'description':
          validationResult = validateDescription(data.description);
          return validationResult.isValid ? undefined : validationResult.error;
        case 'logo':
          validationResult = validateLogo(data.logo);
          return validationResult.isValid ? undefined : validationResult.error;
        case 'date_release':
          validationResult = validateDateRelease(data.date_release);
          return validationResult.isValid ? undefined : validationResult.error;
        case 'date_revision':
          validationResult = validateDateRevision(data.date_revision, data.date_release);
          return validationResult.isValid ? undefined : validationResult.error;
        default:
          return undefined;
      }
    },
    []
  );
  
  const handleChange = useCallback(
    (field: keyof ProductFormData, value: string) => {
      setFormData((prev: ProductFormData) => {
        const nextData: ProductFormData = { ...prev, [field]: value };

        if (field === 'date_release') {
          nextData.date_revision = value ? calculateRevisionDate(value) : '';
        }

        setErrors((prevErrors) => {
          const nextErrors = { ...prevErrors };

          delete nextErrors._form;

          const fieldError = getFieldValidationError(field, nextData);
          if (fieldError) {
            nextErrors[field] = fieldError;
          } else {
            delete nextErrors[field];
          }

          if (field === 'date_release') {
            const revisionError = getFieldValidationError('date_revision', nextData);
            if (revisionError) {
              nextErrors.date_revision = revisionError;
            } else {
              delete nextErrors.date_revision;
            }
          }

          return nextErrors;
        });

        return nextData;
      });
    },
    [getFieldValidationError]
  );
  
  const handleBlur = useCallback(
    async (field: keyof ProductFormData) => {
      const fieldError = getFieldValidationError(field, formData);
      if (fieldError) {
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
        return;
      }

      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });

      if (field === 'id' && mode === 'create' && formData.id) {
        setIsIdChecking(true);
        try {
          const exists = await productsApi.verifyProductId(formData.id);
          if (exists) {
            setErrors((prev) => ({ ...prev, id: 'Este ID ya existe' }));
          }
        } catch (error) {
          console.error('Error verificando ID:', error);
        } finally {
          setIsIdChecking(false);
        }
      }
    },
    [formData, getFieldValidationError, mode]
  );
  
  const handleSubmit = useCallback(async () => {  
    const validation = validateProductForm(formData, {  
      checkExistence: mode === 'create',  
    });  
  
    if (!validation.isValid) {  
      setErrors(validation.errors);  
      return;  
    }  
  
    setIsSubmitting(true);  
    try {  
      if (mode === 'create') {  
        await productsApi.createProduct(formData);  
      } else if (mode === 'edit' && productId) {  
        await productsApi.updateProduct(productId, formData);  
      }  
        
      navigation.goBack();  
    } catch (error) {  
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el producto';  
      setErrors((prev) => ({ ...prev, _form: errorMessage }));  
    } finally {  
      setIsSubmitting(false);  
    }  
  }, [formData, mode, productId, navigation]);  
  
  const isFieldDisabled = useCallback((field: keyof ProductFormData): boolean => {  
    // En modo edición, el ID debe estar deshabilitado  
    if (mode === 'edit' && field === 'id') {  
      return true;  
    }  
    return false;  
  }, [mode]);  
  
  return {  
    formData,  
    errors,  
    isLoading,  
    isSubmitting,  
    isIdChecking,  
    mode,  
    handleChange,  
    handleBlur,  
    handleSubmit,  
    isFieldDisabled,  
  };  
};