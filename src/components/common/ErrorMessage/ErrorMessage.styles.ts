import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const errorStyles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.danger,
    fontWeight: theme.typography.fontWeight.medium,
  },
});