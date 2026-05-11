import { create } from 'zustand';  
  
interface UIState {  
  globalError: string | null;  
  isLoading: boolean;  
  setGlobalError: (error: string | null) => void;  
  setLoading: (loading: boolean) => void;  
  clearError: () => void;  
}  
  
export const useUIStore = create<UIState>((set) => ({  
  globalError: null,  
  isLoading: false,  
  setGlobalError: (error) => set({ globalError: error }),  
  setLoading: (loading) => set({ isLoading: loading }),  
  clearError: () => set({ globalError: null }),  
}));