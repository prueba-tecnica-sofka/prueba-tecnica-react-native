export const colors = {  
  // Primary colors  
  primary: '#F4C300',  
  primaryDark: '#D1A700',  
  primaryLight: '#FFE066',  
    
  // Secondary colors  
  secondary: '#E9EEF5',  
  secondaryDark: '#667085',  
  secondaryLight: '#F4F7FB',  
    
  // Semantic colors  
  success: '#28A745',  
  warning: '#FFC107',  
  danger: '#D71920',  
  info: '#17A2B8',  
    
  // Neutral colors  
  white: '#FFFFFF',  
  black: '#000000',  
  gray50: '#F8F9FA',  
  gray100: '#E9ECEF',  
  gray200: '#DEE2E6',  
  gray300: '#CED4DA',  
  gray400: '#ADB5BD',  
  gray500: '#6C757D',  
  gray600: '#495057',  
  gray700: '#343A40',  
  gray800: '#212529',  
  gray900: '#111827',  
    
  // Background  
  background: '#FFFFFF',  
  backgroundSecondary: '#F9FAFB',  
    
  // Text  
  text: '#1F2937',  
  textSecondary: '#667085',  
  textLight: '#ADB5BD',  
    
  // Border  
  border: '#D1D5DB',  
  borderLight: '#E5E7EB',  
    
  // Overlay  
  overlay: 'rgba(0, 0, 0, 0.5)',  
    
  // Transparent  
  transparent: 'transparent',  
} as const;  
  
export type Colors = typeof colors;