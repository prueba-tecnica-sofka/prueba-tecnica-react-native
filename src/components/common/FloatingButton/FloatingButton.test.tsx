import React from 'react';  
import { render, fireEvent } from '@testing-library/react-native';  
import { FloatingActionButton } from './FloatingButton';  
  
describe('FloatingActionButton', () => {  
  const mockOnPress = jest.fn();  
  
  beforeEach(() => {  
    jest.clearAllMocks();  
  });  
  
  it('renders correctly with default props', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton onPress={mockOnPress} />  
    );  
  
    expect(getByTestId('fab')).toBeTruthy();  
    expect(getByTestId('fab-icon')).toBeTruthy();  
  });  
  
  it('renders with custom icon', () => {  
    const { getByText } = render(  
      <FloatingActionButton onPress={mockOnPress} icon="✎" />  
    );  
  
    expect(getByText('✎')).toBeTruthy();  
  });  
  
  it('calls onPress when pressed', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton onPress={mockOnPress} />  
    );  
  
    fireEvent.press(getByTestId('fab'));  
    expect(mockOnPress).toHaveBeenCalledTimes(1);  
  });  
  
  it('does not call onPress when disabled', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton onPress={mockOnPress} disabled />  
    );  
  
    fireEvent.press(getByTestId('fab'));  
    expect(mockOnPress).not.toHaveBeenCalled();  
  });  
  
  it('renders with small size', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton onPress={mockOnPress} size="small" />  
    );  
  
    const fab = getByTestId('fab');  
    expect(fab.props.style).toMatchObject({  
      width: 40,  
      height: 40,  
      borderRadius: 20,  
    });  
  });  
  
  it('renders with medium size', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton onPress={mockOnPress} size="medium" />  
    );  
  
    const fab = getByTestId('fab');  
    expect(fab.props.style).toMatchObject({  
      width: 56,  
      height: 56,  
      borderRadius: 28,  
    });  
  });  
  
  it('renders with large size', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton onPress={mockOnPress} size="large" />  
    );  
  
    const fab = getByTestId('fab');  
    expect(fab.props.style).toMatchObject({  
      width: 64,  
      height: 64,  
      borderRadius: 32,  
    });  
  });  
  
  it('renders with primary variant', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton onPress={mockOnPress} variant="primary" />  
    );  
  
    const fab = getByTestId('fab');  
    expect(fab.props.style).toMatchObject({  
      backgroundColor: expect.any(String),  
    });  
  });  
  
  it('renders with secondary variant', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton onPress={mockOnPress} variant="secondary" />  
    );  
  
    const fab = getByTestId('fab');  
    expect(fab.props.style).toMatchObject({  
      backgroundColor: expect.any(String),  
    });  
  });  
  
  it('renders with danger variant', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton onPress={mockOnPress} variant="danger" />  
    );  
  
    const fab = getByTestId('fab');  
    expect(fab.props.style).toMatchObject({  
      backgroundColor: expect.any(String),  
    });  
  });  
  
  it('applies custom style', () => {  
    const { getByTestId } = render(  
      <FloatingActionButton  
        onPress={mockOnPress}  
        style={{ bottom: 40, right: 40 }}  
      />  
    );  
  
    const fab = getByTestId('fab');  
    expect(fab.props.style).toMatchObject({  
      bottom: 40,  
      right: 40,  
    });  
  });  
  
  it('has correct accessibility label', () => {  
    const { getByLabelText } = render(  
      <FloatingActionButton  
        onPress={mockOnPress}  
        accessibilityLabel="Crear nuevo producto"  
      />  
    );  
  
    expect(getByLabelText('Crear nuevo producto')).toBeTruthy();  
  });  
  
  it('has accessibility role button', () => {  
    const { getByRole } = render(  
      <FloatingActionButton onPress={mockOnPress} />  
    );  
  
    expect(getByRole('button')).toBeTruthy();  
  });  
  
  it('reports disabled state to accessibility', () => {  
    const { getByRole } = render(  
      <FloatingActionButton onPress={mockOnPress} disabled />  
    );  
  
    const button = getByRole('button');  
    expect(button.props.accessibilityState).toEqual({ disabled: true });  
  });  
});