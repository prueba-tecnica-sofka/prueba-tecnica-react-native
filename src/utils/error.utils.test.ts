import { describe, expect, it } from '@jest/globals';
import { AppError, ErrorType, getErrorMessage, getErrorTypeFromStatus } from './error.utils';

describe('error.utils', () => {
  it('getErrorTypeFromStatus mapea estados HTTP correctamente', () => {
    expect(getErrorTypeFromStatus(undefined)).toBe(ErrorType.NETWORK);
    expect(getErrorTypeFromStatus(400)).toBe(ErrorType.VALIDATION);
    expect(getErrorTypeFromStatus(401)).toBe(ErrorType.AUTH);
    expect(getErrorTypeFromStatus(403)).toBe(ErrorType.AUTH);
    expect(getErrorTypeFromStatus(404)).toBe(ErrorType.NOT_FOUND);
    expect(getErrorTypeFromStatus(409)).toBe(ErrorType.VALIDATION);
    expect(getErrorTypeFromStatus(500)).toBe(ErrorType.SERVER);
    expect(getErrorTypeFromStatus(302)).toBe(ErrorType.UNKNOWN);
  });

  it('getErrorMessage extrae mensaje segun tipo de error', () => {
    const appError = new AppError('error app', ErrorType.SERVER, 500);
    const genericError = new Error('error generic');

    expect(getErrorMessage(appError)).toBe('error app');
    expect(getErrorMessage(genericError)).toBe('error generic');
    expect(getErrorMessage({})).toBe('Error desconocido');
  });
});
