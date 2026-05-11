import React from 'react';  
import {  
  View,  
  Text,  
  TextInput,  
  TextInputProps,  
} from 'react-native';  
import { inputPlaceholderColor, inputStyles } from './Input.styles';
  
export interface InputProps extends TextInputProps {  
  label: string;  
  value: string;  
  onChangeText: (text: string) => void;  
  error?: string;  
  disabled?: boolean;  
  placeholder?: string;  
  testID?: string;  
}  
  
export const Input: React.FC<InputProps> = ({  
  label,  
  value,  
  onChangeText,  
  error,  
  disabled = false,  
  placeholder,  
  testID,  
  ...textInputProps  
}) => {  
  return (  
    <View style={inputStyles.container} testID={testID}>  
      <Text style={inputStyles.label} testID={`${testID}-label`}>  
        {label}  
      </Text>  
      <TextInput  
        testID={`${testID}-input`}  
        style={[  
          inputStyles.input,  
          error && inputStyles.inputError,  
          disabled && inputStyles.inputDisabled,  
        ]}  
        value={value}  
        onChangeText={onChangeText}  
        placeholder={placeholder}  
        placeholderTextColor={inputPlaceholderColor}  
        editable={!disabled}  
        {...textInputProps}  
      />  
      {error && (  
        <Text style={inputStyles.errorText} testID={`${testID}-error`}>  
          {error}  
        </Text>  
      )}  
    </View>  
  );  
};

