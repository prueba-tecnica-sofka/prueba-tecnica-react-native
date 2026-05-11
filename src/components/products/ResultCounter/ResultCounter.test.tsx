import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';

import ResultCounter from './ResultCounter';

describe('ResultCounter', () => {
	it('renders singular label when count is 1', () => {
		const { getByTestId, getByText } = render(<ResultCounter count={1} testID="result-counter" />);

		expect(getByTestId('result-counter')).toBeTruthy();
		expect(getByTestId('result-counter-text')).toBeTruthy();
		expect(getByText('1 resultado')).toBeTruthy();
	});

	it('renders plural label when count is different from 1', () => {
		const { getByText, rerender } = render(<ResultCounter count={0} testID="result-counter" />);

		expect(getByText('0 resultados')).toBeTruthy();

		rerender(<ResultCounter count={5} testID="result-counter" />);
		expect(getByText('5 resultados')).toBeTruthy();
	});
});
