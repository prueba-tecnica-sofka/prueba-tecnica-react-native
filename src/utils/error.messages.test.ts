import { describe, expect, it } from '@jest/globals';
import { ErrorMessages, getErrorMessageByKey } from './error.messages';

describe('error.messages', () => {
  it('getErrorMessageByKey retorna mensaje esperado', () => {
    expect(getErrorMessageByKey('NETWORK_ERROR')).toBe(ErrorMessages.NETWORK_ERROR);
    expect(getErrorMessageByKey('UNAUTHORIZED')).toBe(ErrorMessages.UNAUTHORIZED);
  });
});
