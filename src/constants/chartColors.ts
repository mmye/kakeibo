/**
 * チャートカラー定義
 * @see doc/design_theme.md
 */

/**
 * 収支推移グラフ用カラー
 */
export const CHART_COLORS = {
  income: '#059669',
  expense: '#DC2626',
  balance: '#2D6A4F',
} as const;

/**
 * トレンドチャート用カラー
 */
export const TREND_COLORS = {
  income: '#059669',
  expense: '#DC2626',
  balance: '#2D6A4F',
} as const;

/**
 * セマンティックカラー（意味を持つ色）
 */
export const SEMANTIC_COLORS = {
  income: '#059669',
  incomeLight: '#D1FAE5',
  expense: '#DC2626',
  expenseLight: '#FEE2E2',
  neutral: '#6B7280',
  warning: '#D97706',
  warningLight: '#FEF3C7',
} as const;

/**
 * プライマリカラー
 */
export const PRIMARY_COLORS = {
  primary: '#2D6A4F',
  primaryLight: '#40916C',
  primaryDark: '#1B4332',
} as const;

/**
 * セカンダリカラー
 */
export const SECONDARY_COLORS = {
  secondary: '#B07D62',
  secondaryLight: '#D4A574',
  secondaryDark: '#8B5E3C',
} as const;

/**
 * ベースカラー
 */
export const BASE_COLORS = {
  background: '#FDFBF7',
  surface: '#FFFFFF',
  surfaceHover: '#F9F7F3',
  border: '#E5E1D8',
  borderStrong: '#D1CCC0',
} as const;

/**
 * テキストカラー
 */
export const TEXT_COLORS = {
  primary: '#1F2937',
  secondary: '#6B7280',
  tertiary: '#9CA3AF',
  onPrimary: '#FFFFFF',
} as const;
