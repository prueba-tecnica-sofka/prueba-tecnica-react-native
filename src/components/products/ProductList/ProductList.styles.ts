import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const productListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.padding.md,
    paddingVertical: theme.spacing.padding.sm,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  separator: {
    height: theme.spacing.xs,
  },
});
