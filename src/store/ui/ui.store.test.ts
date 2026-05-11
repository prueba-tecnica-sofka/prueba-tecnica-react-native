import { beforeEach, describe, expect, it } from '@jest/globals';
import { useUIStore } from './ui.store';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ globalError: null, isLoading: false });
  });

  it('setGlobalError actualiza el error global', () => {
    useUIStore.getState().setGlobalError('Algo salio mal');

    expect(useUIStore.getState().globalError).toBe('Algo salio mal');
  });

  it('setLoading actualiza el estado de carga', () => {
    useUIStore.getState().setLoading(true);
    expect(useUIStore.getState().isLoading).toBe(true);

    useUIStore.getState().setLoading(false);
    expect(useUIStore.getState().isLoading).toBe(false);
  });

  it('clearError limpia el error global', () => {
    useUIStore.setState({ globalError: 'Error previo' });

    useUIStore.getState().clearError();

    expect(useUIStore.getState().globalError).toBeNull();
  });
});
