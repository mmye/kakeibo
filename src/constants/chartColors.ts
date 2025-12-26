/**
 * チャートカラー定義
 * Cozy Comic Theme
 * @see doc/design_theme.md
 */

/**
 * 収支推移グラフ用カラー
 */
export const CHART_COLORS = {
  income: '#38BDF8', // Blanket Blue
  expense: '#F43F5E', // Sally Rose
  balance: '#FBBF24', // Woodstock Yellow
} as const;

/**
 * トレンドチャート用カラー
 */
export const TREND_COLORS = {
  income: '#38BDF8', // Blanket Blue
  expense: '#F43F5E', // Sally Rose
  balance: '#FBBF24', // Woodstock Yellow
} as const;

/**
 * セマンティックカラー（意味を持つ色）
 */
export const SEMANTIC_COLORS = {
  income: '#38BDF8',
  incomeLight: '#E0F2FE',
  expense: '#F43F5E',
  expenseLight: '#FFE4E6',
  neutral: '#9CA3AF',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
} as const;

/**
 * プライマリカラー (Woodstock Yellow)
 */
export const PRIMARY_COLORS = {
  primary: '#FBBF24',
  primaryLight: '#FDE68A',
  primaryDark: '#D97706',
} as const;

/**
 * セカンダリカラー (Blanket Blue)
 */
export const SECONDARY_COLORS = {
  secondary: '#38BDF8',
  secondaryLight: '#E0F2FE',
  secondaryDark: '#0284C7',
} as const;

/**
 * ベースカラー
 */
export const BASE_COLORS = {
  background: '#FDFBF7',
  surface: '#FFFFFF',
  surfaceHover: '#FAFAFA',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
} as const;

/**
 * テキストカラー
 */
export const TEXT_COLORS = {
  primary: '#1F2937',
  secondary: '#6B7280',
  tertiary: '#9CA3AF',
  onPrimary: '#1F2937', // Yellow背景上のテキストはダーク
} as const;
