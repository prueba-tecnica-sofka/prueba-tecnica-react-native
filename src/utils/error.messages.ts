export const ErrorMessages = {  
  // Network errors  
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',  
  SERVER_UNAVAILABLE: 'El servidor no está disponible. Intenta más tarde.',  
    
  // Validation errors  
  INVALID_ID: 'El ID debe tener entre 3 y 10 caracteres alfanuméricos.',  
  ID_ALREADY_EXISTS: 'Este ID ya está en uso.',  
  INVALID_NAME: 'El nombre debe tener entre 5 y 100 caracteres.',  
  INVALID_DESCRIPTION: 'La descripción debe tener entre 10 y 200 caracteres.',  
  INVALID_LOGO: 'El logo debe ser una URL válida.',  
  INVALID_DATE_RELEASE: 'La fecha de liberación debe ser futura.',  
    
  // API errors  
  PRODUCT_NOT_FOUND: 'Producto no encontrado.',  
  PRODUCT_CREATE_FAILED: 'Error al crear el producto.',  
  PRODUCT_UPDATE_FAILED: 'Error al actualizar el producto.',  
  PRODUCT_DELETE_FAILED: 'Error al eliminar el producto.',  
    
  // Generic errors  
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.',  
  UNAUTHORIZED: 'No tienes permiso para realizar esta acción.',  
} as const;  
  
export const getErrorMessageByKey = (key: keyof typeof ErrorMessages): string => {  
  return ErrorMessages[key];  
};