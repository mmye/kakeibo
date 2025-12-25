/**
 * Tailwind CSS拡張用のテーマ定義
 * tailwind.config.ts で使用
 */

export const colors = {
  // Primary
  primary: {
    DEFAULT: '#2D6A4F',
    light: '#40916C',
    dark: '#1B4332',
  },
  // Secondary
  secondary: {
    DEFAULT: '#B07D62',
    light: '#D4A574',
    dark: '#8B5E3C',
  },
  // Semantic
  income: {
    DEFAULT: '#059669',
    light: '#D1FAE5',
  },
  expense: {
    DEFAULT: '#DC2626',
    light: '#FEE2E2',
  },
  warning: {
    DEFAULT: '#D97706',
    light: '#FEF3C7',
  },
  // Base
  background: '#FDFBF7',
  surface: {
    DEFAULT: '#FFFFFF',
    hover: '#F9F7F3',
  },
  border: {
    DEFAULT: '#E5E1D8',
    strong: '#D1CCC0',
  },
  // Text
  'text-primary': '#1F2937',
  'text-secondary': '#6B7280',
  'text-tertiary': '#9CA3AF',
};

export const fontFamily = {
  heading: ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
  body: ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
  mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
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
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
};

export const boxShadow = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.07)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
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
