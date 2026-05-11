import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import SearchBar from './SearchBar';

describe('SearchBar', () => {
	const mockOnChangeText = jest.fn();
	const mockOnClear = jest.fn();

	beforeEach(() => {
		mockOnChangeText.mockClear();
		mockOnClear.mockClear();
	});

	it('renders base structure with default placeholder', () => {
		const { getByTestId } = render(
			<SearchBar value="" onChangeText={mockOnChangeText} testID="search-bar" />,
		);

		expect(getByTestId('search-bar')).toBeTruthy();
		expect(getByTestId('search-bar-input')).toBeTruthy();
		expect(getByTestId('search-bar-input').props.placeholder).toBe('Buscar productos...');
	});

	it('calls onChangeText when input value changes', () => {
		const { getByTestId } = render(
			<SearchBar value="" onChangeText={mockOnChangeText} testID="search-bar" />,
		);

		fireEvent.changeText(getByTestId('search-bar-input'), 'credito');

		expect(mockOnChangeText).toHaveBeenCalledTimes(1);
		expect(mockOnChangeText).toHaveBeenCalledWith('credito');
	});

	it('shows clear button when value is not empty and clears text when pressed', () => {
		const { getByTestId } = render(
			<SearchBar
				value="credito"
				onChangeText={mockOnChangeText}
				onClear={mockOnClear}
				testID="search-bar"
			/>,
		);

		fireEvent.press(getByTestId('search-bar-clear'));

		expect(mockOnChangeText).toHaveBeenCalledWith('');
		expect(mockOnClear).toHaveBeenCalledTimes(1);
	});

	it('hides clear button when value is empty', () => {
		const { queryByTestId } = render(
			<SearchBar value="" onChangeText={mockOnChangeText} testID="search-bar" />,
		);

		expect(queryByTestId('search-bar-clear')).toBeNull();
	});

	it('shows loading spinner when isLoading is true', () => {
		const { getByTestId } = render(
			<SearchBar value="credito" onChangeText={mockOnChangeText} isLoading testID="search-bar" />,
		);

		expect(getByTestId('search-bar-loading')).toBeTruthy();
		expect(getByTestId('search-bar-loading-indicator')).toBeTruthy();
	});
});
