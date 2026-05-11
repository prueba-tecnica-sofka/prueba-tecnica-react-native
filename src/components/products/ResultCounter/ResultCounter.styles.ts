import { StyleSheet } from 'react-native';

import { theme } from '../../../theme';

export const resultCounterStyles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	text: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.fontSize.sm,
		fontWeight: theme.typography.fontWeight.medium,
	},
});
