import { colors, type Colors } from './colors';  
import { typography, type Typography } from './typography';  
import { spacing, type Spacing } from './spacing';  
  
export const theme = {  
  colors,  
  typography,  
  spacing,  
} as const;  
  
export type Theme = typeof theme;  
export type { Colors, Typography, Spacing };  
  
export default theme;