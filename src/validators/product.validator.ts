import { ValidationResult, IdValidationOptions } from './validation.types';  
import {  
  isDateTodayOrFuture,  
  isValidRevisionDate,  
  isValidDateFormat,  
} from '../utils/date.utils';  
  
/**  
 * Constantes de validación  
 */  
export const VALIDATION_RULES = {  
  ID: {  
    MIN_LENGTH: 3,  
    MAX_LENGTH: 10,  
    PATTERN: /^[a-zA-Z0-9-]+$/,  
  },  
  NAME: {  
    MIN_LENGTH: 5,  
    MAX_LENGTH: 100,  
  },  
  DESCRIPTION: {  
    MIN_LENGTH: 10,  
    MAX_LENGTH: 200,  
  },  
} as const;  
  
/**  
 * Mensajes de error  
 */  
export const ERROR_MESSAGES = {  
  ID_REQUIRED: 'El ID es requerido',  
  ID_MIN_LENGTH: `El ID debe tener mínimo ${VALIDATION_RULES.ID.MIN_LENGTH} caracteres`,  
  ID_MAX_LENGTH: `El ID debe tener máximo ${VALIDATION_RULES.ID.MAX_LENGTH} caracteres`,  
  ID_INVALID_FORMAT: 'El ID solo puede contener letras, números y guiones',  
  ID_EXISTS: 'Este ID ya existe',  
  NAME_REQUIRED: 'El nombre es requerido',  
  NAME_MIN_LENGTH: `El nombre debe tener mínimo ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`,  
  NAME_MAX_LENGTH: `El nombre debe tener máximo ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`,  
  DESCRIPTION_REQUIRED: 'La descripción es requerida',  
  DESCRIPTION_MIN_LENGTH: `La descripción debe tener mínimo ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} caracteres`,  
  DESCRIPTION_MAX_LENGTH: `La descripción debe tener máximo ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} caracteres`,  
  LOGO_REQUIRED: 'El logo es requerido',  
  LOGO_INVALID_URL: 'El logo debe ser una URL válida',  
  DATE_RELEASE_REQUIRED: 'La fecha de liberación es requerida',  
  DATE_RELEASE_INVALID_FORMAT: 'Formato de fecha inválido (use YYYY-MM-DD)',  
  DATE_RELEASE_PAST: 'La fecha de liberación debe ser hoy o futura',  
  DATE_REVISION_REQUIRED: 'La fecha de revisión es requerida',  
  DATE_REVISION_INVALID_FORMAT: 'Formato de fecha inválido (use YYYY-MM-DD)',  
  DATE_REVISION_INVALID: 'La fecha de revisión debe ser exactamente 1 año después de la fecha de liberación',  
} as const;  
  
/**  
 * Valida el campo ID  
 */  
export const validateId = (  
  value: string,  
  options: IdValidationOptions = {}  
): ValidationResult => {  
  if (!value || value.trim() === '') {  
    return { isValid: false, error: ERROR_MESSAGES.ID_REQUIRED };  
  }  
  
  const trimmedValue = value.trim();  
  
  if (trimmedValue.length < VALIDATION_RULES.ID.MIN_LENGTH) {  
    return { isValid: false, error: ERROR_MESSAGES.ID_MIN_LENGTH };  
  }  
  
  if (trimmedValue.length > VALIDATION_RULES.ID.MAX_LENGTH) {  
    return { isValid: false, error: ERROR_MESSAGES.ID_MAX_LENGTH };  
  }  
  
  if (!VALIDATION_RULES.ID.PATTERN.test(trimmedValue)) {  
    return { isValid: false, error: ERROR_MESSAGES.ID_INVALID_FORMAT };  
  }  
  
  // Verificación de existencia (síncrona para IDs conocidos)  
  if (  
    options.checkExistence &&  
    !options.skipExistenceCheck &&  
    options.existingIds &&  
    options.existingIds.includes(trimmedValue)  
  ) {  
    return { isValid: false, error: ERROR_MESSAGES.ID_EXISTS };  
  }  
  
  return { isValid: true };  
};  
  
/**  
 * Valida el campo nombre  
 */  
export const validateName = (value: string): ValidationResult => {  
  if (!value || value.trim() === '') {  
    return { isValid: false, error: ERROR_MESSAGES.NAME_REQUIRED };  
  }  
  
  const trimmedValue = value.trim();  
  
  if (trimmedValue.length < VALIDATION_RULES.NAME.MIN_LENGTH) {  
    return { isValid: false, error: ERROR_MESSAGES.NAME_MIN_LENGTH };  
  }  
  
  if (trimmedValue.length > VALIDATION_RULES.NAME.MAX_LENGTH) {  
    return { isValid: false, error: ERROR_MESSAGES.NAME_MAX_LENGTH };  
  }  
  
  return { isValid: true };  
};  
  
/**  
 * Valida el campo descripción  
 */  
export const validateDescription = (value: string): ValidationResult => {  
  if (!value || value.trim() === '') {  
    return { isValid: false, error: ERROR_MESSAGES.DESCRIPTION_REQUIRED };  
  }  
  
  const trimmedValue = value.trim();  
  
  if (trimmedValue.length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {  
    return { isValid: false, error: ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH };  
  }  
  
  if (trimmedValue.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {  
    return { isValid: false, error: ERROR_MESSAGES.DESCRIPTION_MAX_LENGTH };  
  }  
  
  return { isValid: true };  
};  
  
/**  
 * Valida el campo logo (URL)  
 */  
export const validateLogo = (value: string): ValidationResult => {  
  if (!value || value.trim() === '') {  
    return { isValid: false, error: ERROR_MESSAGES.LOGO_REQUIRED };  
  }  
  
  const trimmedValue = value.trim();  
  
  try {  
    new URL(trimmedValue);  
    return { isValid: true };  
  } catch {  
    return { isValid: false, error: ERROR_MESSAGES.LOGO_INVALID_URL };  
  }  
};  
  
/**  
 * Valida el campo fecha de liberación  
 */  
export const validateDateRelease = (value: string): ValidationResult => {  
  if (!value || value.trim() === '') {  
    return { isValid: false, error: ERROR_MESSAGES.DATE_RELEASE_REQUIRED };  
  }  
  
  const trimmedValue = value.trim();  
  
  if (!isValidDateFormat(trimmedValue)) {  
    return { isValid: false, error: ERROR_MESSAGES.DATE_RELEASE_INVALID_FORMAT };  
  }  
  
  if (!isDateTodayOrFuture(trimmedValue)) {  
    return { isValid: false, error: ERROR_MESSAGES.DATE_RELEASE_PAST };  
  }  
  
  return { isValid: true };  
};  
  
/**  
 * Valida el campo fecha de revisión  
 */  
export const validateDateRevision = (  
  value: string,  
  dateRelease: string  
): ValidationResult => {  
  if (!value || value.trim() === '') {  
    return { isValid: false, error: ERROR_MESSAGES.DATE_REVISION_REQUIRED };  
  }  
  
  const trimmedValue = value.trim();  
  
  if (!isValidDateFormat(trimmedValue)) {  
    return { isValid: false, error: ERROR_MESSAGES.DATE_REVISION_INVALID_FORMAT };  
  }  
  
  if (!isValidRevisionDate(dateRelease, trimmedValue)) {  
    return { isValid: false, error: ERROR_MESSAGES.DATE_REVISION_INVALID };  
  }  
  
  return { isValid: true };  
};  
  
/**  
 * Interfaz para datos de producto a validar  
 */  
export interface ProductFormData {  
  id: string;  
  name: string;  
  description: string;  
  logo: string;  
  date_release: string;  
  date_revision: string;  
}  
  
/**  
 * Valida todo el formulario de producto  
 */  
export const validateProductForm = (  
  data: ProductFormData,  
  options: IdValidationOptions = {}  
): { isValid: boolean; errors: Record<string, string> } => {  
  const errors: Record<string, string> = {};  
  
  const idResult = validateId(data.id, options);  
  if (!idResult.isValid) {  
    errors.id = idResult.error!;  
  }  
  
  const nameResult = validateName(data.name);  
  if (!nameResult.isValid) {  
    errors.name = nameResult.error!;  
  }  
  
  const descriptionResult = validateDescription(data.description);  
  if (!descriptionResult.isValid) {  
    errors.description = descriptionResult.error!;  
  }  
  
  const logoResult = validateLogo(data.logo);  
  if (!logoResult.isValid) {  
    errors.logo = logoResult.error!;  
  }  
  
  const dateReleaseResult = validateDateRelease(data.date_release);  
  if (!dateReleaseResult.isValid) {  
    errors.date_release = dateReleaseResult.error!;  
  }  
  
  // Solo validar date_revision si date_release es válido  
  if (!errors.date_release) {  
    const dateRevisionResult = validateDateRevision(  
      data.date_revision,  
      data.date_release  
    );  
    if (!dateRevisionResult.isValid) {  
      errors.date_revision = dateRevisionResult.error!;  
    }  
  }  
  
  return {  
    isValid: Object.keys(errors).length === 0,  
    errors,  
  };  
};