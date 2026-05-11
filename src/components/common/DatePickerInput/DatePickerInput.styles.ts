import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const datePickerStyles = StyleSheet.create({
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
  touchable: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  touchableError: {
    borderColor: theme.colors.danger,
  },
  touchableDisabled: {
    backgroundColor: theme.colors.backgroundSecondary,
  },
  valueText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  placeholderText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textLight,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  icon: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
});
