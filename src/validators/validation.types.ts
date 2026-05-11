
export interface ValidationResult {  
  isValid: boolean;  
  error?: string;  
}  
  
export interface FormValidationResult {  
  isValid: boolean;  
  errors: Record<string, string>;  
}  
   
export interface IdValidationOptions {  
  checkExistence?: boolean;  
  existingIds?: string[];  
  skipExistenceCheck?: boolean;  
}