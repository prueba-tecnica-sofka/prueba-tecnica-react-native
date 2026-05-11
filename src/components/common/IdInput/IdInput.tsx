import React from 'react';
import { Text, View } from 'react-native';
import { Input } from '../Input/Input';
import { idInputStyles } from './IdInput.styles';  
  
export interface IdInputProps {  
  value: string;  
  onChangeText: (text: string) => void;  
  onBlur: () => void;  
  error?: string;  
  isChecking?: boolean;
  disabled?: boolean;  
  placeholder?: string;  
  testID?: string;  
  isEditMode?: boolean;  
  maxLength?: number;  
}  
  
export const IdInput: React.FC<IdInputProps> = ({  
  value,  
  onChangeText,  
  onBlur,  
  error,  
  isChecking = false,
  disabled = false,  
  placeholder = 'Ej: prod-123',  
  testID = 'id-input',  
  isEditMode = false,  
  maxLength = 10,  
}) => {  
  const isInputDisabled = disabled || isEditMode;
  
  return (  
    <View style={idInputStyles.container} testID={`${testID}-container`}>  
      <Input  
        label="ID *"  
        value={value}  
        onChangeText={onChangeText}  
        onBlur={onBlur}
        error={error}
        disabled={isInputDisabled}
        placeholder={placeholder}  
        testID={testID}
        maxLength={maxLength}  
        autoCapitalize="none"  
        autoCorrect={false}  
      />  
  
      {isChecking && (  
        <Text  
          style={[  
            idInputStyles.statusText,  
            isChecking && idInputStyles.checkingText,  
          ]}  
          testID={`${testID}-status`}  
        >  
          Verificando ID...
        </Text>  
      )}  
    </View>  
  );  
};