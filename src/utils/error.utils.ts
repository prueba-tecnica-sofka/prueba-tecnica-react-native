export enum ErrorType {  
  NETWORK = 'NETWORK',  
  VALIDATION = 'VALIDATION',  
  AUTH = 'AUTH',  
  NOT_FOUND = 'NOT_FOUND',  
  SERVER = 'SERVER',  
  UNKNOWN = 'UNKNOWN',  
}  
  
export class AppError extends Error {  
  constructor(  
    message: string,  
    public type: ErrorType = ErrorType.UNKNOWN,  
    public statusCode?: number,  
    public originalError?: unknown  
  ) {  
    super(message);  
    this.name = 'AppError';  
  }  
}  
  
export const getErrorTypeFromStatus = (status?: number): ErrorType => {  
  if (!status) return ErrorType.NETWORK;  
    
  if (status >= 400 && status < 500) {  
    if (status === 400) return ErrorType.VALIDATION;  
    if (status === 401 || status === 403) return ErrorType.AUTH;  
    if (status === 404) return ErrorType.NOT_FOUND;  
    return ErrorType.VALIDATION;  
  }  
    
  if (status >= 500) return ErrorType.SERVER;  
    
  return ErrorType.UNKNOWN;  
};  
  
export const getErrorMessage = (error: unknown): string => {  
  if (error instanceof AppError) return error.message;  
  if (error instanceof Error) return error.message;  
  return 'Error desconocido';  
};