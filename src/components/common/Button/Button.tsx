import React from 'react';  
import {  
  TouchableOpacity,  
  Text,  
  ActivityIndicator,  
} from 'react-native';  
import { buttonStyles } from './Button.styles';  
import { theme } from '../../../theme';  
  
export interface ButtonProps {  
  title: string;  
  onPress: () => void;  
  variant?: 'primary' | 'secondary' | 'danger';  
  disabled?: boolean;  
  loading?: boolean;  
  testID?: string;  
}  
  
export const Button: React.FC<ButtonProps> = ({  
  title,  
  onPress,  
  variant = 'primary',  
  disabled = false,  
  loading = false,  
  testID,  
}) => {  
  const isDisabled = disabled || loading;  
  const loadingColor = variant === 'danger' ? theme.colors.white : buttonStyles.loading.color;  
  
  return (  
    <TouchableOpacity  
      testID={testID}  
      style={[  
        buttonStyles.button,  
        buttonStyles[variant],  
        isDisabled && buttonStyles.disabled,  
      ]}  
      onPress={onPress}  
      disabled={isDisabled}  
      activeOpacity={0.7}  
    >  
      {loading ? (  
        <ActivityIndicator   
          testID={`${testID}-loading`}  
          color={loadingColor}   
        />  
      ) : (  
        <Text   
          style={[  
            buttonStyles.text,  
            buttonStyles[`${variant}Text`],  
          ]}  
          testID={`${testID}-text`}  
        >  
          {title}  
        </Text>  
      )}  
    </TouchableOpacity>  
  );  
};