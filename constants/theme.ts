import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const COLORS = {
  primary: {
    main: '#0063D1',
    light: '#4D94E5',
    dark: '#0046A3',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#465A65',
    light: '#738591',
    dark: '#2E3D45',
    contrast: '#FFFFFF',
  },
  accent: {
    main: '#FF6B00',
    light: '#FF924D',
    dark: '#CC5500',
    contrast: '#FFFFFF',
  },
  success: {
    main: '#2CC069',
    light: '#65D495',
    dark: '#218F4F',
    contrast: '#FFFFFF',
  },
  warning: {
    main: '#FFB800',
    light: '#FFCB4D',
    dark: '#CC9300',
    contrast: '#1F2937',
  },
  error: {
    main: '#F53D3D',
    light: '#F87171',
    dark: '#C32424',
    contrast: '#FFFFFF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F7FA',
    tertiary: '#E5E9F0',
  },
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
    disabled: '#D1D5DB',
    inverse: '#FFFFFF',
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const SIZES = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const FONTS = {
  regular: 'Poppins-Regular',
  semibold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const BORDER_RADIUS = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  round: 9999,
};