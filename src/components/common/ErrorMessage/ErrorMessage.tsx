import React from 'react';  
import { View, Text } from 'react-native';
import { ErrorMessages } from '../../../utils/error.messages';
import { getErrorMessage } from '../../../utils/error.utils';
import { errorStyles } from './ErrorMessage.styles';  
  
export interface ErrorMessageProps {  
  message?: string;
  error?: unknown;
  fallbackMessage?: string;
  visible: boolean;  
  testID?: string;  
}  
  
export const ErrorMessage: React.FC<ErrorMessageProps> = ({  
  message,  
  error,
  fallbackMessage = ErrorMessages.UNKNOWN_ERROR,
  visible,  
  testID,  
}) => {  
  const resolvedMessage = message || getErrorMessage(error);
  const safeMessage =
    resolvedMessage && resolvedMessage !== 'Error desconocido'
      ? resolvedMessage
      : fallbackMessage;

  if (!visible || !safeMessage.trim()) {
    return null;  
  }  
  
  return (  
    <View style={errorStyles.container} testID={testID}>  
      <Text style={errorStyles.text} testID={`${testID}-text`}>  
        {safeMessage}
      </Text>  
    </View>  
  );  
};