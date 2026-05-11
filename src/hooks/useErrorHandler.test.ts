import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useErrorHandler } from './useErrorHandler';
import { AppError, ErrorType } from '../utils/error.utils';

describe('useErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  it('retorna error de validacion inline sin mostrar alerta', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new AppError('Nombre invalido', ErrorType.VALIDATION, 400);

    const message = result.current.handleError(error, true);

    expect(message).toBe('Nombre invalido');
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('muestra alerta para error de red cuando no es inline', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new AppError('Sin red', ErrorType.NETWORK, 0);

    const message = result.current.handleError(error);

    expect(message).toBe('Sin red');
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error de Conexión',
      'Error de conexión. Verifica tu internet.'
    );
  });

  it('usa fallback de error desconocido con errores no tipados', () => {
    const { result } = renderHook(() => useErrorHandler());

    const message = result.current.handleError({ foo: 'bar' });

    expect(message).toBe('Error desconocido');
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Ocurrió un error inesperado.');
  });

  it('muestra mensajes para AUTH, NOT_FOUND y SERVER', () => {
    const { result } = renderHook(() => useErrorHandler());

    result.current.handleError(new AppError('auth', ErrorType.AUTH, 401));
    result.current.handleError(new AppError('nf', ErrorType.NOT_FOUND, 404));
    result.current.handleError(new AppError('srv', ErrorType.SERVER, 500));

    expect(Alert.alert).toHaveBeenCalledWith('No Autorizado', 'No tienes permiso para realizar esta acción.');
    expect(Alert.alert).toHaveBeenCalledWith('No Encontrado', 'Producto no encontrado.');
    expect(Alert.alert).toHaveBeenCalledWith('Error del Servidor', 'El servidor no está disponible. Intenta más tarde.');
  });

  it('en modo inline para errores no validacion no dispara alertas', () => {
    const { result } = renderHook(() => useErrorHandler());
    const message = result.current.handleError(new AppError('auth-inline', ErrorType.AUTH), true);

    expect(message).toBe('auth-inline');
    expect(Alert.alert).not.toHaveBeenCalled();
  });
});
