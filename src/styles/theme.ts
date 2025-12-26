/**
 * Tailwind CSS拡張用のテーマ定義
 * tailwind.config.ts で使用
 * Cozy Comic Theme
 */

export const colors = {
  // Primary (Woodstock Yellow)
  primary: {
    DEFAULT: '#FBBF24',
    light: '#FDE68A',
    dark: '#D97706',
  },
  // Secondary (Blanket Blue)
  secondary: {
    DEFAULT: '#38BDF8',
    light: '#E0F2FE',
    dark: '#0284C7',
  },
  // Semantic
  income: {
    DEFAULT: '#38BDF8',
    light: '#E0F2FE',
  },
  expense: {
    DEFAULT: '#F43F5E',
    light: '#FFE4E6',
  },
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FEF3C7',
  },
  // Base
  background: '#FDFBF7',
  surface: {
    DEFAULT: '#FFFFFF',
    hover: '#FAFAFA',
  },
  border: {
    DEFAULT: '#E5E7EB',
    strong: '#D1D5DB',
  },
  // Text
  'text-primary': '#1F2937',
  'text-secondary': '#6B7280',
  'text-tertiary': '#9CA3AF',
};

export const fontFamily = {
  heading: ['M PLUS Rounded 1c', 'Quicksand', 'sans-serif'],
  body: ['M PLUS Rounded 1c', 'Quicksand', 'sans-serif'],
  number: ['Quicksand', 'Varela Round', 'sans-serif'],
};

export const fontSize = {
  display: ['2rem', { lineHeight: '1.2' }] as const,
  h1: ['1.5rem', { lineHeight: '1.3' }] as const,
  h2: ['1.25rem', { lineHeight: '1.4' }] as const,
  h3: ['1rem', { lineHeight: '1.4' }] as const,
  body: ['0.875rem', { lineHeight: '1.6' }] as const,
  small: ['0.75rem', { lineHeight: '1.5' }] as const,
  tiny: ['0.625rem', { lineHeight: '1.4' }] as const,
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
};

export const boxShadow = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  card: '0 4px 6px -1px rgba(0,0,0,0.02)',
  md: '0 4px 6px rgba(0,0,0,0.02)',
  lg: '0 10px 15px rgba(0,0,0,0.05)',
  xl: '0 20px 25px rgba(0,0,0,0.1)',
};

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
};
