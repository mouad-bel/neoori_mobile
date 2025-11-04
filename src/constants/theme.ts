// Design System Theme Constants

// Type pour le thème
type ThemeType = 'dark' | 'light';

// Thème actuel (à implémenter avec un système de préférences)
export const CURRENT_THEME: ThemeType = 'dark';

// Palette de couleurs de base
const PALETTE = {
  // Bleus
  blue50: '#F0F9FF',
  blue100: '#E0F2FE',
  blue200: '#BAE6FD',
  blue300: '#7DD3FC',
  blue400: '#38BDF8',
  blue500: '#0EA5E9',
  blue600: '#0284C7',
  blue700: '#0369A1',
  blue800: '#075985',
  blue900: '#0C4A6E',
  
  // Gris
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  gray950: '#020617',
  
  // États
  red500: '#EF4444',   // Error
  red600: '#DC2626',   // Error hover
  green500: '#10B981', // Success
  green600: '#059669', // Success hover
  amber500: '#F59E0B', // Warning
  amber600: '#D97706', // Warning hover
  
  // Autres
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Thèmes
const THEMES = {
  dark: {
    // Background
    background: PALETTE.gray900,
    cardBackground: PALETTE.gray800,
    surfaceBackground: PALETTE.gray800,
    
    // Primary
    primary: PALETTE.blue400,
    primaryDark: PALETTE.blue600,
    primaryLight: PALETTE.blue300,
    
    // Text
    textPrimary: PALETTE.white,
    textSecondary: PALETTE.gray300,
    textTertiary: PALETTE.gray400,
    
    // States
    error: PALETTE.red500,
    errorDark: PALETTE.red600,
    success: PALETTE.green500,
    successDark: PALETTE.green600,
    warning: PALETTE.amber500,
    warningDark: PALETTE.amber600,
    
    // Social
    like: PALETTE.red500,
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    
    // Transparents
    transparent: PALETTE.transparent,
    semiTransparent: 'rgba(30, 41, 59, 0.8)',
    
    // Focus
    focus: PALETTE.blue400,
    focusRing: `0 0 0 2px ${PALETTE.blue700}`,
    
    // Borders
    border: PALETTE.gray700,
    borderLight: PALETTE.gray600,
  },
  
  light: {
    // Background
    background: PALETTE.gray50,
    cardBackground: PALETTE.white,
    surfaceBackground: PALETTE.gray100,
    
    // Primary
    primary: PALETTE.blue600,
    primaryDark: PALETTE.blue700,
    primaryLight: PALETTE.blue400,
    
    // Text
    textPrimary: PALETTE.gray900,
    textSecondary: PALETTE.gray600,
    textTertiary: PALETTE.gray500,
    
    // States
    error: PALETTE.red500,
    errorDark: PALETTE.red600,
    success: PALETTE.green500,
    successDark: PALETTE.green600,
    warning: PALETTE.amber500,
    warningDark: PALETTE.amber600,
    
    // Social
    like: PALETTE.red500,
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.4)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
    
    // Transparents
    transparent: PALETTE.transparent,
    semiTransparent: 'rgba(241, 245, 249, 0.8)',
    
    // Focus
    focus: PALETTE.blue500,
    focusRing: `0 0 0 2px ${PALETTE.blue300}`,
    
    // Borders
    border: PALETTE.gray300,
    borderLight: PALETTE.gray200,
  },
};

// Exporter les couleurs du thème actuel
export const COLORS = THEMES[CURRENT_THEME];

// Exporter tous les thèmes pour permettre le changement de thème
export const ALL_THEMES = THEMES;

export const FONTS = {
  family: 'Inter',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
} as const;

export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

