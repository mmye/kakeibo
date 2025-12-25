import type { Config } from 'tailwindcss';
import { colors, fontFamily, fontSize, borderRadius, boxShadow, spacing } from './src/styles/theme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize,
      borderRadius,
      boxShadow,
      spacing,
    },
  },
  plugins: [],
} satisfies Config;
