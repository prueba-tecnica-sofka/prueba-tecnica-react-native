import { useCallback } from 'react';  
import { Alert } from 'react-native';  
import { AppError, ErrorType, getErrorMessage } from '../utils/error.utils';  
import { ErrorMessages } from '../utils/error.messages';  
  
export const useErrorHandler = () => {  
  const handleError = useCallback((error: unknown, showInline: boolean = false) => {  
    const message = getErrorMessage(error);  
      
    if (error instanceof AppError) {  
      // Manejo específico por tipo de error  
      switch (error.type) {  
        case ErrorType.NETWORK:  
          if (!showInline) {  
            Alert.alert('Error de Conexión', ErrorMessages.NETWORK_ERROR);  
          }  
          break;  
            
        case ErrorType.VALIDATION:  
          // Errores de validación se muestran inline  
          return message;  
            
        case ErrorType.AUTH:  
          if (!showInline) {  
            Alert.alert('No Autorizado', ErrorMessages.UNAUTHORIZED);  
          }  
          break;  
            
        case ErrorType.NOT_FOUND:  
          if (!showInline) {  
            Alert.alert('No Encontrado', ErrorMessages.PRODUCT_NOT_FOUND);  
          }  
          break;  
            
        case ErrorType.SERVER:  
          if (!showInline) {  
            Alert.alert('Error del Servidor', ErrorMessages.SERVER_UNAVAILABLE);  
          }  
          break;  
            
        default:  
          if (!showInline) {  
            Alert.alert('Error', ErrorMessages.UNKNOWN_ERROR);  
          }  
      }  
    } else {  
      if (!showInline) {  
        Alert.alert('Error', ErrorMessages.UNKNOWN_ERROR);  
      }  
    }  
      
    return message;  
  }, []);  
  
  return { handleError };  
};