import { StyleSheet } from 'react-native';  
import { theme } from '../../../theme';  
  
export const buttonStyles = StyleSheet.create({  
  button: {  
    paddingVertical: 12,  
    paddingHorizontal: 20,  
    borderRadius: 4,  
    alignItems: 'center',  
    justifyContent: 'center',  
    minHeight: 48,  
  },  
  primary: {  
    backgroundColor: theme.colors.primary,  
  },  
  secondary: {  
    backgroundColor: theme.colors.secondary,  
    borderWidth: 1,  
    borderColor: theme.colors.border,  
  },  
  danger: {  
    backgroundColor: theme.colors.danger,  
  },  
  primaryText: {  
    color: theme.colors.text,  
  },  
  secondaryText: {  
    color: theme.colors.text,  
  },  
  dangerText: {  
    color: theme.colors.white,  
  },  
  text: {  
    fontSize: theme.typography.fontSize.base,  
    fontWeight: '600',  
    letterSpacing: 0.2,  
  },  
  disabled: {  
    opacity: 0.5,  
  },  
  loading: {  
    color: theme.colors.text,  
  },  
});