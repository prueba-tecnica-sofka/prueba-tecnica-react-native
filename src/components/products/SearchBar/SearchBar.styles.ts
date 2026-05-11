import { StyleSheet } from 'react-native';

import { theme } from '../../../theme';

export const searchBarPlaceholderColor = theme.colors.textLight;

export const searchBarStyles = StyleSheet.create({
	clearButton: {
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: theme.spacing.sm,
		paddingHorizontal: theme.spacing.sm,
	},
	clearButtonText: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.fontSize.sm,
		fontWeight: theme.typography.fontWeight.medium,
	},
	container: {
		alignItems: 'center',
		backgroundColor: theme.colors.white,
		borderColor: theme.colors.border,
		borderRadius: theme.spacing.borderRadius.md,
		borderWidth: 1,
		flexDirection: 'row',
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
	},
	input: {
		color: theme.colors.text,
		flex: 1,
		fontSize: theme.typography.fontSize.base,
		paddingVertical: 0,
	},
});
