import { StyleSheet } from 'react-native';  
import { theme } from '../../../theme';  
  
export const idInputStyles = StyleSheet.create({  
  container: {  
    marginBottom: theme.spacing.md,  
  },  
  statusText: {  
    fontSize: theme.typography.fontSize.sm,  
    marginTop: theme.spacing.xs,  
    marginLeft: theme.spacing.sm,  
  },  
  checkingText: {  
    color: theme.colors.textSecondary,  
  },  
  availableText: {  
    color: theme.colors.success,  
  },  
  unavailableText: {  
    color: theme.colors.warning,  
  },  
});