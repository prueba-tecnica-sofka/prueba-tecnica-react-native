import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  const baseProps = {
    message: 'This is an error message',
    visible: true,
    testID: 'test-error',
  } as const;

  it('renders container and text when visible is true', () => {
    const { getByTestId, getByText } = render(<ErrorMessage {...baseProps} />);

    expect(getByTestId('test-error')).toBeTruthy();
    expect(getByTestId('test-error-text')).toBeTruthy();
    expect(getByText('This is an error message')).toBeTruthy();
  });

  it('does not render anything when visible is false', () => {
    const { queryByTestId, queryByText } = render(
      <ErrorMessage {...baseProps} visible={false} />
    );

    expect(queryByTestId('test-error')).toBeNull();
    expect(queryByTestId('test-error-text')).toBeNull();
    expect(queryByText('This is an error message')).toBeNull();
  });

  it('renders the provided message', () => {
    const { getByText } = render(
      <ErrorMessage {...baseProps} message="Field is required" />
    );

    expect(getByText('Field is required')).toBeTruthy();
  });

  it('builds text testID from base testID', () => {
    const { getByTestId } = render(
      <ErrorMessage {...baseProps} testID="custom-error" />
    );

    expect(getByTestId('custom-error')).toBeTruthy();
    expect(getByTestId('custom-error-text')).toBeTruthy();
  });

  it('uses theme-based styles for the error text', () => {
    const { getByTestId } = render(<ErrorMessage {...baseProps} />);

    const flattenedTextStyle = StyleSheet.flatten(
      getByTestId('test-error-text').props.style
    );

    expect(flattenedTextStyle.color).toBe(theme.colors.danger);
    expect(flattenedTextStyle.fontSize).toBe(theme.typography.fontSize.sm);
    expect(flattenedTextStyle.fontWeight).toBe(theme.typography.fontWeight.medium);
  });
});