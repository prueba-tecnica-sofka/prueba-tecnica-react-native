import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { Button } from './Button';
import { theme } from '../../../theme';

describe('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders title and text testID when not loading', () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <Button title="Test Button" onPress={mockOnPress} testID="test-button" />
    );

    expect(getByTestId('test-button')).toBeTruthy();
    expect(getByTestId('test-button-text')).toBeTruthy();
    expect(getByText('Test Button')).toBeTruthy();
    expect(queryByTestId('test-button-loading')).toBeNull();
  });

  it('calls onPress when pressed and enabled', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={mockOnPress} testID="test-button" />
    );

    fireEvent.press(getByTestId('test-button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const { getByTestId } = render(
      <Button
        title="Test Button"
        onPress={mockOnPress}
        disabled
        testID="test-button"
      />
    );

    const button = getByTestId('test-button');

    expect(button.props.disabled).toBe(true);
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('shows loader and disables press when loading', () => {
    const { getByTestId, queryByTestId, queryByText } = render(
      <Button
        title="Test Button"
        onPress={mockOnPress}
        loading
        testID="test-button"
      />
    );

    const button = getByTestId('test-button');

    expect(button.props.disabled).toBe(true);
    expect(getByTestId('test-button-loading')).toBeTruthy();
    expect(queryByTestId('test-button-text')).toBeNull();
    expect(queryByText('Test Button')).toBeNull();

    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies primary variant by default', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={mockOnPress} testID="test-button" />
    );

    const flattenedStyle = StyleSheet.flatten(getByTestId('test-button').props.style);

    expect(flattenedStyle.backgroundColor).toBe(theme.colors.primary);
  });

  it('applies secondary variant styles', () => {
    const { getByTestId } = render(
      <Button
        title="Test Button"
        onPress={mockOnPress}
        variant="secondary"
        testID="test-button"
      />
    );

    const buttonStyle = StyleSheet.flatten(getByTestId('test-button').props.style);
    const textStyle = StyleSheet.flatten(getByTestId('test-button-text').props.style);

    expect(buttonStyle.backgroundColor).toBe(theme.colors.secondary);
    expect(textStyle.color).toBe(theme.colors.text);
  });

  it('applies danger variant styles', () => {
    const { getByTestId } = render(
      <Button
        title="Test Button"
        onPress={mockOnPress}
        variant="danger"
        testID="test-button"
      />
    );

    const buttonStyle = StyleSheet.flatten(getByTestId('test-button').props.style);
    const textStyle = StyleSheet.flatten(getByTestId('test-button-text').props.style);

    expect(buttonStyle.backgroundColor).toBe(theme.colors.danger);
    expect(textStyle.color).toBe(theme.colors.white);
  });
});