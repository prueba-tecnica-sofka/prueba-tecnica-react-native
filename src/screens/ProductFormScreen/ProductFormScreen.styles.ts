import { Platform, StyleSheet } from 'react-native';  
import { theme } from '../../theme';  
  
export const formStyles = StyleSheet.create({  
  container: {  
    flex: 1,  
    backgroundColor: theme.colors.backgroundSecondary,  
  },  
  header: {  
    backgroundColor: theme.colors.primary,  
    paddingVertical: theme.spacing.md,  
    paddingHorizontal: theme.spacing.lg,  
    paddingTop: Platform.OS === 'ios' ? 50 : theme.spacing.lg,  
  },  
  headerTitle: {  
    fontSize: theme.typography.fontSize.xl,  
    fontWeight: theme.typography.fontWeight.bold,  
    color: theme.colors.text,  
  },  
  scrollView: {  
    flex: 1,  
  },  
  scrollContent: {  
    padding: theme.spacing.lg,  
  },  
  form: {  
    gap: theme.spacing.md,  
  },  
  checkingText: {  
    fontSize: theme.typography.fontSize.sm,  
    color: theme.colors.textSecondary,  
    marginTop: -theme.spacing.sm,  
    marginBottom: theme.spacing.sm,  
    marginLeft: theme.spacing.sm,  
  },  
  buttonContainer: {  
    marginTop: theme.spacing.md,  
  },  
});