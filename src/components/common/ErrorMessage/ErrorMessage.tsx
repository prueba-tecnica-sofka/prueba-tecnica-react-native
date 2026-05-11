import React from 'react';  
import { View, Text, StyleSheet } from 'react-native';  
import { errorStyles } from './ErrorMessage.styles';  
  
export interface ErrorMessageProps {  
  message: string;  
  visible: boolean;  
  testID?: string;  
}  
  
export const ErrorMessage: React.FC<ErrorMessageProps> = ({  
  message,  
  visible,  
  testID,  
}) => {  
  if (!visible) {  
    return null;  
  }  
  
  return (  
    <View style={errorStyles.container} testID={testID}>  
      <Text style={errorStyles.text} testID={`${testID}-text`}>  
        {message}  
      </Text>  
    </View>  
  );  
};