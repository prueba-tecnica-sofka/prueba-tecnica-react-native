import { StyleSheet } from 'react-native';  
import { theme } from '../../../theme';  
  
export const inputStyles = StyleSheet.create({  
  container: {  
    marginBottom: theme.spacing.md,  
  },  
  label: {  
    fontSize: theme.typography.fontSize.sm,  
    fontWeight: '600',  
    color: theme.colors.text,  
    marginBottom: theme.spacing.sm,  
    letterSpacing: 0.2,  
  },  
  input: {  
    height: 48,  
    borderWidth: 1,  
    borderColor: theme.colors.border,  
    borderRadius: theme.spacing.borderRadius.sm,  
    paddingHorizontal: theme.spacing.md,  
    fontSize: theme.typography.fontSize.base,  
    color: theme.colors.text,  
    backgroundColor: theme.colors.background,  
  },  
  inputError: {  
    borderColor: theme.colors.danger,  
    backgroundColor: theme.colors.background,  
  },  
  inputDisabled: {  
    backgroundColor: theme.colors.backgroundSecondary,  
    color: theme.colors.textSecondary,  
  },  
  errorText: {  
    fontSize: theme.typography.fontSize.xs,  
    color: theme.colors.danger,  
    marginTop: theme.spacing.xs,  
    fontWeight: '500',  
  },  
});

export const inputPlaceholderColor = theme.colors.textLight;