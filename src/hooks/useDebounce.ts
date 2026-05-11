import { useState, useEffect } from 'react';  
  
/**  
 * Hook para implementar debounce en valores  
 * @param value - Valor a debouncear  
 * @param delay - Retraso en milisegundos (default: 300ms)  
 * @returns Valor con debounce aplicado  
 */  
export function useDebounce<T>(value: T, delay: number = 300): T {  
  const [debouncedValue, setDebouncedValue] = useState<T>(value);  
  
  useEffect(() => {  
    const timer = setTimeout(() => {  
      setDebouncedValue(value);  
    }, delay);  
  
    return () => {  
      clearTimeout(timer);  
    };  
  }, [value, delay]);  
  
  return debouncedValue;  
}