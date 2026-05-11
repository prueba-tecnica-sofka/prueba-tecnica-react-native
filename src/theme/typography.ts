export const typography = {  
  // Font families  
  fontFamily: {  
    regular: 'System',  
    medium: 'System',  
    bold: 'System',  
    light: 'System',  
  },  
    
  // Font sizes  
  fontSize: {  
    xs: 10,  
    sm: 12,  
    base: 14,  
    md: 16,  
    lg: 18,  
    xl: 20,  
    '2xl': 24,  
    '3xl': 30,  
    '4xl': 36,  
  },  
    
  // Font weights  
  fontWeight: {  
    regular: '400' as const,  
    medium: '500' as const,  
    bold: '700' as const,  
    light: '300' as const,  
  },  
    
  // Line heights  
  lineHeight: {  
    tight: 1.2,  
    normal: 1.5,  
    relaxed: 1.75,  
  },  
} as const;  
  
export type Typography = typeof typography;