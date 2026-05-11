import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { IdInput } from './IdInput';  
  
describe('IdInput', () => {  
  const defaultProps = {  
    value: '',  
    onChangeText: jest.fn(),  
    onBlur: jest.fn(),  
  };  
  
  beforeEach(() => {  
    jest.clearAllMocks();  
  });  
  
  it('renders correctly', () => {  
    const { getByTestId } = render(<IdInput {...defaultProps} />);  
    expect(getByTestId('id-input')).toBeTruthy();  
  });  
  
  it('shows checking text when isChecking is true', () => {  
    const { getByText } = render(
      <IdInput {...defaultProps} value="test" isChecking />
    );

    expect(getByText('Verificando ID...')).toBeTruthy();  
  });  
  
  it('shows field error from form state', () => {
    const { getByText } = render(
      <IdInput {...defaultProps} value="test" error="Este ID ya existe" />
    );

    expect(getByText('Este ID ya existe')).toBeTruthy();
  });  
  
  it('calls onBlur on input blur', () => {  
    const { getByTestId } = render(<IdInput {...defaultProps} value="valid-id" />);  
      
    const input = getByTestId('id-input-input');  
    fireEvent(input, 'blur');  
  
    expect(defaultProps.onBlur).toHaveBeenCalled();  
  });  
  
  it('calls onChangeText when input changes', () => {
    const { getByTestId } = render(<IdInput {...defaultProps} value="" />);

    const input = getByTestId('id-input-input');
    fireEvent.changeText(input, 'new-id');

    expect(defaultProps.onChangeText).toHaveBeenCalledWith('new-id');
  });  
  
  it('is disabled when disabled prop is true', () => {  
    const { getByTestId } = render(<IdInput {...defaultProps} disabled />);  
      
    const input = getByTestId('id-input-input');  
    expect(input.props.editable).toBe(false);  
  });  
  
  it('is disabled in edit mode', () => {  
    const { getByTestId } = render(<IdInput {...defaultProps} isEditMode />);  
      
    const input = getByTestId('id-input-input');  
    expect(input.props.editable).toBe(false);  
  });  
});