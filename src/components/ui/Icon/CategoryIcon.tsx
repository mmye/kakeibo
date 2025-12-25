import { Icon, type IconSize, type IconProps } from './Icon';
import { getCategoryColor, getCategoryIcon } from '@/constants';

export type CategoryIconProps = {
  /** カテゴリ名 */
  category: string;
  /** サイズ */
  size?: IconSize;
  /** カスタムクラス */
  className?: string | undefined;
} & Omit<IconProps, 'name' | 'color' | 'size' | 'className'>;

/**
 * カテゴリ別アイコンコンポーネント
 * カテゴリに応じた色とアイコンを自動的に表示する
 */
export function CategoryIcon({ category, size = 'md', className, ...props }: CategoryIconProps) {
  const iconName = getCategoryIcon(category);
  const color = getCategoryColor(category);

  return <Icon name={iconName} size={size} color={color} className={className} {...props} />;
}
