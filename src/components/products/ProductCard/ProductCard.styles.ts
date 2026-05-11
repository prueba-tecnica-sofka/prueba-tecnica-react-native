import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const productCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: theme.spacing.borderRadius.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: 0.1,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  },
  id: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textLight,
    letterSpacing: 0.2,
  },
  chevron: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.textLight,
  },
});
