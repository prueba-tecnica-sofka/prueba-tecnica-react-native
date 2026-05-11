import React from 'react';  
import {  
  TouchableOpacity,  
  Text,  
  StyleSheet,  
  ViewStyle,  
  TextStyle,  
} from 'react-native';  
import { fabStyles } from './FloatingButton.styles';  
import { theme } from '../../../theme';  
  
export interface FloatingActionButtonProps {  
  onPress: () => void;  
  icon?: string;  
  size?: 'small' | 'medium' | 'large';  
  variant?: 'primary' | 'secondary' | 'danger';  
  disabled?: boolean;  
  style?: ViewStyle;  
  testID?: string;  
  accessibilityLabel?: string;  
}  
  
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({  
  onPress,  
  icon = '+',  
  size = 'medium',  
  variant = 'primary',  
  disabled = false,  
  style,  
  testID = 'fab',  
  accessibilityLabel = 'Agregar',  
}) => {  
  const sizeStyles = fabStyles[size];  
  const variantStyles = fabStyles[variant];  
  
  return (  
    <TouchableOpacity  
      testID={testID}  
      style={[  
        fabStyles.fab,  
        sizeStyles,  
        variantStyles,  
        disabled && fabStyles.disabled,  
        style,  
      ]}  
      onPress={onPress}  
      disabled={disabled}  
      activeOpacity={0.7}  
      accessibilityLabel={accessibilityLabel}  
      accessibilityRole="button"  
      accessibilityState={{ disabled }}  
    >  
      <Text  
        style={[  
          fabStyles.icon,  
          sizeStyles.icon,  
          variantStyles.icon,  
        ]}  
        testID={`${testID}-icon`}  
      >  
        {icon}  
      </Text>  
    </TouchableOpacity>  
  );  
};