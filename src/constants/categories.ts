/**
 * カテゴリ定義
 * 色とアイコンの情報を含む
 */

export type CategoryInfo = {
  color: string;
  icon: string;
};

/**
 * カテゴリ別の定義（色・アイコン）
 * @see doc/design_theme.md チャートカラー
 */
export const CATEGORIES: Record<string, CategoryInfo> = {
  食費: { color: '#FBBF24', icon: 'utensils' }, // Yellow
  日用品: { color: '#A78BFA', icon: 'shopping-bag' }, // Soft Purple
  交通費: { color: '#38BDF8', icon: 'train' }, // Blue
  通信費: { color: '#22D3EE', icon: 'smartphone' }, // Cyan
  '教養・教育': { color: '#34D399', icon: 'book-open' }, // Emerald
  '健康・医療': { color: '#F472B6', icon: 'heart-pulse' }, // Pink
  '衣服・美容': { color: '#FB923C', icon: 'shirt' }, // Orange
  '趣味・娯楽': { color: '#818CF8', icon: 'gamepad-2' }, // Indigo
  '水道・光熱費': { color: '#2DD4BF', icon: 'zap' }, // Teal
  交際費: { color: '#F43F5E', icon: 'users' }, // Rose
  その他: { color: '#9CA3AF', icon: 'more-horizontal' }, // Gray
  収入: { color: '#38BDF8', icon: 'arrow-up-circle' }, // Blue
} as const;

/** その他カテゴリのデフォルト色 */
const DEFAULT_COLOR = '#9CA3AF';

/** その他カテゴリのデフォルトアイコン */
const DEFAULT_ICON = 'more-horizontal';

/**
 * カテゴリの色を取得
 * @param category カテゴリ名
 * @returns HEXカラーコード（未定義の場合は「その他」の色）
 */
export function getCategoryColor(category: string): string {
  return CATEGORIES[category]?.color ?? DEFAULT_COLOR;
}

/**
 * カテゴリのアイコン名を取得
 * @param category カテゴリ名
 * @returns Lucide Iconアイコン名（未定義の場合は「その他」のアイコン）
 */
export function getCategoryIcon(category: string): string {
  return CATEGORIES[category]?.icon ?? DEFAULT_ICON;
}
