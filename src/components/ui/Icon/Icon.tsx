import {
  Utensils,
  ShoppingBag,
  Train,
  Smartphone,
  BookOpen,
  HeartPulse,
  Shirt,
  Gamepad2,
  Zap,
  Users,
  MoreHorizontal,
  ArrowUpCircle,
  Camera,
  Heart,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';
import { cn } from '@/utils';

/** アイコン名からLucideIconへのマッピング */
const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  train: Train,
  smartphone: Smartphone,
  'book-open': BookOpen,
  'heart-pulse': HeartPulse,
  shirt: Shirt,
  'gamepad-2': Gamepad2,
  zap: Zap,
  users: Users,
  'more-horizontal': MoreHorizontal,
  'arrow-up-circle': ArrowUpCircle,
  camera: Camera,
  heart: Heart,
};

/** サイズマッピング */
const SIZE_MAP = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export type IconProps = {
  /** アイコン名 (kebab-case) */
  name: string;
  /** サイズ */
  size?: IconSize;
  /** 色 */
  color?: string;
  /** カスタムクラス */
  className?: string | undefined;
} & Omit<LucideProps, 'size' | 'className'>;

/**
 * Lucide Iconsラッパーコンポーネント
 * アイコン名を文字列で指定してアイコンを表示する
 */
export function Icon({ name, size = 'md', color, className, ...props }: IconProps) {
  const IconComponent = ICON_MAP[name] ?? MoreHorizontal;
  const pixelSize = SIZE_MAP[size];

  return <IconComponent size={pixelSize} color={color} className={cn(className)} {...props} />;
}
