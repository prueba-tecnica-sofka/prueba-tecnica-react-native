import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Input } from './Input';
  
describe('Input', () => {  
  const mockOnChangeText = jest.fn();  
  
  beforeEach(() => {  
    mockOnChangeText.mockClear();  
  });  
  
  it('renders correctly with default props', () => {  
    const { getByTestId, getByText } = render(  
      <Input  
        label="Test Label"  
        value="test value"  
        onChangeText={mockOnChangeText}  
        testID="test-input"  
      />  
    );  
  
    expect(getByTestId('test-input')).toBeTruthy();  
    expect(getByTestId('test-input-label')).toBeTruthy();  
    expect(getByText('Test Label')).toBeTruthy();  
    expect(getByTestId('test-input-input')).toBeTruthy();  
  });  
  
  it('displays the current value', () => {  
    const { getByTestId } = render(  
      <Input  
        label="Test Label"  
        value="initial value"  
        onChangeText={mockOnChangeText}  
        testID="test-input"  
      />  
    );  
  
    const input = getByTestId('test-input-input');  
    expect(input.props.value).toBe('initial value');  
  });  
  
  it('calls onChangeText when text changes', () => {  
    const { getByTestId } = render(  
      <Input  
        label="Test Label"  
        value=""  
        onChangeText={mockOnChangeText}  
        testID="test-input"  
      />  
    );  
  
    const input = getByTestId('test-input-input');  
    fireEvent.changeText(input, 'new value');  
    expect(mockOnChangeText).toHaveBeenCalledWith('new value');  
  });  
  
  it('displays error message when error prop is provided', () => {  
    const { getByTestId, getByText } = render(  
      <Input  
        label="Test Label"  
        value=""  
        onChangeText={mockOnChangeText}  
        error="This field is required"  
        testID="test-input"  
      />  
    );  
  
    expect(getByTestId('test-input-error')).toBeTruthy();  
    expect(getByText('This field is required')).toBeTruthy();  
  });  
  
  it('does not display error message when error prop is not provided', () => {  
    const { queryByTestId } = render(  
      <Input  
        label="Test Label"  
        value=""  
        onChangeText={mockOnChangeText}  
        testID="test-input"  
      />  
    );  
  
    expect(queryByTestId('test-input-error')).toBeNull();  
  });  
  
  it('disables input when disabled prop is true', () => {  
    const { getByTestId } = render(  
      <Input  
        label="Test Label"  
        value="test value"  
        onChangeText={mockOnChangeText}  
        disabled  
        testID="test-input"  
      />  
    );  
  
    const input = getByTestId('test-input-input');  
    expect(input.props.editable).toBe(false);  
  });  
  
  it('enables input when disabled prop is false', () => {  
    const { getByTestId } = render(  
      <Input  
        label="Test Label"  
        value="test value"  
        onChangeText={mockOnChangeText}  
        disabled={false}  
        testID="test-input"  
      />  
    );  
  
    const input = getByTestId('test-input-input');  
    expect(input.props.editable).toBe(true);  
  });  
  
  it('displays placeholder when provided', () => {  
    const { getByTestId } = render(  
      <Input  
        label="Test Label"  
        value=""  
        onChangeText={mockOnChangeText}  
        placeholder="Enter text here"  
        testID="test-input"  
      />  
    );  
  
    const input = getByTestId('test-input-input');  
    expect(input.props.placeholder).toBe('Enter text here');  
  });  
  
  it('passes additional TextInputProps to TextInput', () => {  
    const { getByTestId } = render(  
      <Input  
        label="Test Label"  
        value="test value"  
        onChangeText={mockOnChangeText}  
        keyboardType="numeric"  
        maxLength={10}  
        testID="test-input"  
      />  
    );  
  
    const input = getByTestId('test-input-input');  
    expect(input.props.keyboardType).toBe('numeric');  
    expect(input.props.maxLength).toBe(10);  
  });  
  
  it('does not call onChangeText when disabled', () => {  
    const { getByTestId } = render(  
      <Input  
        label="Test Label"  
        value=""  
        onChangeText={mockOnChangeText}  
        disabled  
        testID="test-input"  
      />  
    );  
  
    const input = getByTestId('test-input-input');  
    fireEvent.changeText(input, 'new value');  
    expect(mockOnChangeText).not.toHaveBeenCalled();  
  });  
});