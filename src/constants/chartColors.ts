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

/**
 * 日別支出チャート用カテゴリカラー
 * Cozy Comic Theme
 */
export const DAILY_CATEGORY_COLORS: Record<string, string> = {
  食費: '#F43F5E', // Sally Rose
  '趣味・娯楽': '#FBBF24', // Woodstock Yellow
  交通費: '#38BDF8', // Blanket Blue
  日用品: '#A78BFA', // Soft Purple
  '健康・医療': '#34D399', // Mint Green
  '水道・光熱費': '#FB923C', // Orange
  通信費: '#06B6D4', // Cyan
  '教養・教育': '#10B981', // Emerald
  '衣服・美容': '#F97316', // Deep Orange
  交際費: '#EF4444', // Red
  住宅: '#8B5CF6', // Violet
  その他: '#6B7280', // Gray
} as const;

/**
 * Get category color for daily spending chart
 * Falls back to gray if category not found
 */
export function getDailyCategoryColor(category: string): string {
  return DAILY_CATEGORY_COLORS[category] ?? '#6B7280';
}
