import React from 'react';
import { render } from '@testing-library/react-native';
import { describe, expect, it } from '@jest/globals';
import { theme } from '../../../theme';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  const testID = 'test-spinner';

  it('renders container and indicator using testID', () => {
    const { getByTestId } = render(<LoadingSpinner testID={testID} />);

    expect(getByTestId(testID)).toBeTruthy();
    expect(getByTestId(`${testID}-indicator`)).toBeTruthy();
  });

  it('uses default size and theme primary color', () => {
    const { getByTestId } = render(<LoadingSpinner testID={testID} />);

    const indicator = getByTestId(`${testID}-indicator`);
    expect(indicator.props.size).toBe('large');
    expect(indicator.props.color).toBe(theme.colors.primary);
  });

  it('renders with custom size and color', () => {
    const { getByTestId } = render(
      <LoadingSpinner size="small" color="#FF3B30" testID={testID} />,
    );

    const indicator = getByTestId(`${testID}-indicator`);
    expect(indicator.props.size).toBe('small');
    expect(indicator.props.color).toBe('#FF3B30');
  });

  it('applies custom style to the container', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <LoadingSpinner style={customStyle} testID={testID} />,
    );

    const container = getByTestId(testID);
    expect(container.props.style).toContainEqual(customStyle);
  });
});