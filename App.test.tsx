import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import App from './App';

describe('App', () => {
  it('renderiza el mensaje inicial', () => {
    const { getByText } = render(<App />);

    expect(getByText('Open up App.tsx to start working on your app!')).toBeTruthy();
  });
});
