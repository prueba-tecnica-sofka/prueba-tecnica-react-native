import React, { memo } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { LoadingSpinner } from '../../common/LoadingSpinner/LoadingSpinner';
import { searchBarPlaceholderColor, searchBarStyles } from './SearchBar.styles';

export interface SearchBarProps {
	value: string;
	onChangeText: (text: string) => void;
	onClear?: () => void;
	placeholder?: string;
	isLoading?: boolean;
	testID?: string;
}

function SearchBarComponent({
	value,
	onChangeText,
	onClear,
	placeholder = 'Buscar productos...',
	isLoading = false,
	testID = 'search-bar',
}: SearchBarProps): React.JSX.Element {
	const showClearButton = value.length > 0;

	const handleClear = (): void => {
		onChangeText('');
		onClear?.();
	};

	return (
		<View style={searchBarStyles.container} testID={testID}>
			<TextInput
				testID={`${testID}-input`}
				style={searchBarStyles.input}
				placeholder={placeholder}
				placeholderTextColor={searchBarPlaceholderColor}
				value={value}
				onChangeText={onChangeText}
				autoCapitalize="none"
				autoCorrect={false}
			/>

			{isLoading ? (
				<LoadingSpinner size="small" testID={`${testID}-loading`} />
			) : null}

			{showClearButton ? (
				<TouchableOpacity
					testID={`${testID}-clear`}
					accessibilityRole="button"
					accessibilityLabel="Limpiar búsqueda"
					onPress={handleClear}
					style={searchBarStyles.clearButton}
				>
					<Text style={searchBarStyles.clearButtonText}>Limpiar</Text>
				</TouchableOpacity>
			) : null}
		</View>
	);
}

const SearchBar = memo(SearchBarComponent);
export default SearchBar;
