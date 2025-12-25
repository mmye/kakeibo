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
  食費: { color: '#F59E0B', icon: 'utensils' },
  日用品: { color: '#8B5CF6', icon: 'shopping-bag' },
  交通費: { color: '#3B82F6', icon: 'train' },
  通信費: { color: '#06B6D4', icon: 'smartphone' },
  '教養・教育': { color: '#10B981', icon: 'book-open' },
  '健康・医療': { color: '#EC4899', icon: 'heart-pulse' },
  '衣服・美容': { color: '#F97316', icon: 'shirt' },
  '趣味・娯楽': { color: '#6366F1', icon: 'gamepad-2' },
  '水道・光熱費': { color: '#14B8A6', icon: 'zap' },
  交際費: { color: '#EF4444', icon: 'users' },
  その他: { color: '#6B7280', icon: 'more-horizontal' },
  収入: { color: '#059669', icon: 'arrow-up-circle' },
} as const;

/** その他カテゴリのデフォルト色 */
const DEFAULT_COLOR = '#6B7280';

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
