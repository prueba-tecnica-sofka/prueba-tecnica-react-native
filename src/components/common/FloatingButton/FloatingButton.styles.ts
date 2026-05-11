import { StyleSheet, TextStyle, ViewStyle } from 'react-native';  
import { theme } from '../../../theme';  
  
interface SizeStyles {  
  width: number;  
  height: number;  
  borderRadius: number;  
  icon?: TextStyle;  
}  
  
interface VariantStyles {  
  backgroundColor?: string;  
  icon?: TextStyle;  
}  
  
export const fabStyles = StyleSheet.create({  
  fab: {  
    position: 'absolute',  
    justifyContent: 'center',  
    alignItems: 'center',  
    shadowColor: '#000',  
    shadowOffset: { width: 0, height: 2 },  
    shadowOpacity: 0.25,  
    shadowRadius: 4,  
    elevation: 5,  
  },  
    
  // Sizes  
  small: {  
    width: 40,  
    height: 40,  
    borderRadius: 20,  
    icon: {  
      fontSize: 20,  
    },  
  } as SizeStyles,  
    
  medium: {  
    width: 56,  
    height: 56,  
    borderRadius: 28,  
    icon: {  
      fontSize: 32,  
    },  
  } as SizeStyles,  
    
  large: {  
    width: 64,  
    height: 64,  
    borderRadius: 32,  
    icon: {  
      fontSize: 36,  
    },  
  } as SizeStyles,  
    
  // Variants  
  primary: {  
    backgroundColor: theme.colors.primary,  
    icon: {  
      color: theme.colors.text,  
    },  
  } as VariantStyles,  
    
  secondary: {  
    backgroundColor: theme.colors.secondary,  
    icon: {  
      color: theme.colors.text,  
    },  
  } as VariantStyles,  
    
  danger: {  
    backgroundColor: theme.colors.danger,  
    icon: {  
      color: theme.colors.white,  
    },  
  } as VariantStyles,  
    
  // States  
  disabled: {  
    opacity: 0.5,  
    elevation: 0,  
    shadowOpacity: 0,  
  },  
    
  icon: {  
    fontWeight: '300',  
    includeFontPadding: false,  
  },  
});