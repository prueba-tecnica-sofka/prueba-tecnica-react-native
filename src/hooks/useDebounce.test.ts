import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('retorna el valor inicial inmediatamente', () => {
    const { result } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');
  });

  it('actualiza el valor luego del delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('second');
  });

  it('cancela timer anterior cuando cambia rapido', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    rerender({ value: 'abc' });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('abc');
  });
});
