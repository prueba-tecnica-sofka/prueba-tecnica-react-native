export const spacing = {  
  // Base spacing unit (4px)  
  xs: 4,  
  sm: 8,  
  md: 12,  
  lg: 16,  
  xl: 20,  
  '2xl': 24,  
  '3xl': 32,  
  '4xl': 40,  
  '5xl': 48,  
  '6xl': 64,  
    
  // Specific spacings  
  padding: {  
    xs: 4,  
    sm: 8,  
    md: 16,  
    lg: 24,  
    xl: 32,  
  },  
    
  margin: {  
    xs: 4,  
    sm: 8,  
    md: 16,  
    lg: 24,  
    xl: 32,  
  },  
    
  // Border radius  
  borderRadius: {  
    none: 0,  
    sm: 4,  
    md: 8,  
    lg: 12,  
    xl: 16,  
    full: 9999,  
  },  
} as const;  
  
export type Spacing = typeof spacing;