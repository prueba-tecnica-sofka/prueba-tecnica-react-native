import {  
  validateId,  
  validateName,  
  validateDescription,  
  validateLogo,  
  validateDateRelease,  
  validateDateRevision,  
  validateProductForm,  
  ERROR_MESSAGES,  
} from './product.validator';  
import { calculateRevisionDate } from '../utils/date.utils';  
  
describe('Product Validators', () => {  
  const formatLocalDate = (date: Date): string => {  
    const year = date.getFullYear();  
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const day = String(date.getDate()).padStart(2, '0');  
    return `${year}-${month}-${day}`;  
  };  

  const getDateOffset = (days: number): string => {  
    const date = new Date();  
    date.setDate(date.getDate() + days);  
    return formatLocalDate(date);  
  };  

  describe('validateId', () => {  
    it('should reject empty ID', () => {  
      const result = validateId('');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.ID_REQUIRED);  
    });  
  
    it('should reject ID shorter than min length', () => {  
      const result = validateId('ab');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.ID_MIN_LENGTH);  
    });  
  
    it('should reject ID longer than max length', () => {  
      const result = validateId('abcdefghijk');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.ID_MAX_LENGTH);  
    });  
  
    it('should reject ID with invalid characters', () => {  
      const result = validateId('abc@123');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.ID_INVALID_FORMAT);  
    });  
  
    it('should accept valid ID', () => {  
      const result = validateId('abc-123');  
      expect(result.isValid).toBe(true);  
      expect(result.error).toBeUndefined();  
    });  
  
    it('should reject existing ID when checkExistence is true', () => {  
      const result = validateId('exist-001', {  
        checkExistence: true,  
        existingIds: ['exist-001'],  
      });  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.ID_EXISTS);  
    });  
  
    it('should skip existence check when skipExistenceCheck is true', () => {  
      const result = validateId('exist-001', {  
        checkExistence: true,  
        existingIds: ['exist-001'],  
        skipExistenceCheck: true,  
      });  
      expect(result.isValid).toBe(true);  
    });  
  });  
  
  describe('validateName', () => {  
    it('should reject empty name', () => {  
      const result = validateName('');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.NAME_REQUIRED);  
    });  
  
    it('should reject name shorter than min length', () => {  
      const result = validateName('abc');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.NAME_MIN_LENGTH);  
    });  
  
    it('should reject name longer than max length', () => {  
      const result = validateName('a'.repeat(101));  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.NAME_MAX_LENGTH);  
    });  
  
    it('should accept valid name', () => {  
      const result = validateName('Producto válido');  
      expect(result.isValid).toBe(true);  
    });  
  
    it('should trim whitespace', () => {  
      const result = validateName('  Producto  ');  
      expect(result.isValid).toBe(true);  
    });  
  });  
  
  describe('validateDescription', () => {  
    it('should reject empty description', () => {  
      const result = validateDescription('');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.DESCRIPTION_REQUIRED);  
    });  
  
    it('should reject description shorter than min length', () => {  
      const result = validateDescription('corta');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH);  
    });  
  
    it('should reject description longer than max length', () => {  
      const result = validateDescription('a'.repeat(201));  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.DESCRIPTION_MAX_LENGTH);  
    });  
  
    it('should accept valid description', () => {  
      const result = validateDescription('Descripción válida del producto');  
      expect(result.isValid).toBe(true);  
    });  
  });  
  
  describe('validateLogo', () => {  
    it('should reject empty logo', () => {  
      const result = validateLogo('');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.LOGO_REQUIRED);  
    });  
  
    it('should reject invalid URL', () => {  
      const result = validateLogo('not-a-url');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.LOGO_INVALID_URL);  
    });  
  
    it('should accept valid URL', () => {  
      const result = validateLogo('https://example.com/logo.png');  
      expect(result.isValid).toBe(true);  
    });  
  });  
  
  describe('validateDateRelease', () => {  
    it('should reject empty date', () => {  
      const result = validateDateRelease('');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.DATE_RELEASE_REQUIRED);  
    });  
  
    it('should reject invalid format', () => {  
      const result = validateDateRelease('2024/01/01');  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.DATE_RELEASE_INVALID_FORMAT);  
    });  
  
    it('should reject past date', () => {  
      const pastDate = '2020-01-01';  
      const result = validateDateRelease(pastDate);  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.DATE_RELEASE_PAST);  
    });  
  
    it('should accept today date', () => {  
      const today = formatLocalDate(new Date());  
      const result = validateDateRelease(today);  
      expect(result.isValid).toBe(true);  
    });  
  
    it('should accept future date', () => {  
      const futureDate = getDateOffset(30);  
      const result = validateDateRelease(futureDate);  
      expect(result.isValid).toBe(true);  
    });  
  });  
  
  describe('validateDateRevision', () => {  
    const validReleaseDate = '2024-01-01';  
    const validRevisionDate = calculateRevisionDate(validReleaseDate);  
  
    it('should reject empty date', () => {  
      const result = validateDateRevision('', validReleaseDate);  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.DATE_REVISION_REQUIRED);  
    });  
  
    it('should reject invalid format', () => {  
      const result = validateDateRevision('2024/01/01', validReleaseDate);  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.DATE_REVISION_INVALID_FORMAT);  
    });  
  
    it('should reject date that is not exactly 1 year later', () => {  
      const result = validateDateRevision('2024-02-01', validReleaseDate);  
      expect(result.isValid).toBe(false);  
      expect(result.error).toBe(ERROR_MESSAGES.DATE_REVISION_INVALID);  
    });  
  
    it('should accept correct revision date', () => {  
      const result = validateDateRevision(validRevisionDate, validReleaseDate);  
      expect(result.isValid).toBe(true);  
    });  
  });  
  
  describe('validateProductForm', () => {  
    const futureReleaseDate = getDateOffset(30);  
    const validFormData = {  
      id: 'prod-123',  
      name: 'Producto de prueba',  
      description: 'Descripción de prueba del producto',  
      logo: 'https://example.com/logo.png',  
      date_release: futureReleaseDate,  
      date_revision: calculateRevisionDate(futureReleaseDate),  
    };  
  
    it('should validate complete valid form', () => {  
      const result = validateProductForm(validFormData);  
      expect(result.isValid).toBe(true);  
      expect(result.errors).toEqual({});  
    });  
  
    it('should return all errors for invalid form', () => {  
      const invalidFormData = {  
        id: '',  
        name: 'abc',  
        description: 'corta',  
        logo: '',  
        date_release: '',  
        date_revision: '',  
      };  
  
      const result = validateProductForm(invalidFormData);  
      expect(result.isValid).toBe(false);  
      expect(Object.keys(result.errors)).toHaveLength(5);  
      expect(result.errors.id).toBe(ERROR_MESSAGES.ID_REQUIRED);  
      expect(result.errors.name).toBe(ERROR_MESSAGES.NAME_MIN_LENGTH);  
      expect(result.errors.description).toBe(ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH);  
      expect(result.errors.logo).toBe(ERROR_MESSAGES.LOGO_REQUIRED);  
      expect(result.errors.date_release).toBe(ERROR_MESSAGES.DATE_RELEASE_REQUIRED);  
      expect(result.errors.date_revision).toBeUndefined();  
    });  
  
    it('should skip date_revision validation when date_release is invalid', () => {  
      const formData = {  
        ...validFormData,  
        date_release: 'invalid-date',  
        date_revision: 'invalid-date',  
      };  
  
      const result = validateProductForm(formData);  
      expect(result.isValid).toBe(false);  
      expect(result.errors.date_release).toBe(ERROR_MESSAGES.DATE_RELEASE_INVALID_FORMAT);  
      expect(result.errors.date_revision).toBeUndefined();  
    });  
  
    it('should check ID existence when option is provided', () => {  
      const formData = {  
        ...validFormData,  
        id: 'exist-001',  
      };  
  
      const result = validateProductForm(formData, {  
        checkExistence: true,  
        existingIds: ['exist-001'],  
      });  
  
      expect(result.isValid).toBe(false);  
      expect(result.errors.id).toBe(ERROR_MESSAGES.ID_EXISTS);  
    });  
  });  
});