import React from 'react';  
import { View, ActivityIndicator, ViewStyle } from 'react-native';  
import { theme } from '../../../theme';
import { loadingStyles } from './LoadingSpinner.styles';  
  
export interface LoadingSpinnerProps {  
  size?: 'small' | 'large';  
  color?: string;  
  testID?: string;  
  style?: ViewStyle;  
}  
  
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({  
  size = 'large',  
  color = theme.colors.primary,  
  testID,  
  style,  
}) => {  
  return (  
    <View   
      style={[loadingStyles.container, style]}   
      testID={testID}  
    >  
      <ActivityIndicator  
        testID={`${testID}-indicator`}  
        size={size}  
        color={color}  
      />  
    </View>  
  );  
};