import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils';
import { formatPercentage } from '@/utils/formatters';

type TrendIndicatorProps = {
  /** 変化率 (0.05 = +5%) */
  value: number;
  /** サイズ */
  size?: 'sm' | 'md';
  /** true: 増加が良い（収入）, false: 増加が悪い（支出） */
  positiveIsGood?: boolean;
  /** カスタムクラス */
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

/**
 * 前月比の増減を表示するインジケーターコンポーネント
 */
export function TrendIndicator({
  value,
  size = 'md',
  positiveIsGood = true,
  className,
  ...props
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  // 増加が良いか悪いかで色を決定
  const isGood = positiveIsGood ? isPositive : !isPositive && !isNeutral;
  const colorClass = isNeutral ? 'text-text-secondary' : isGood ? 'text-income' : 'text-expense';

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const iconSize = size === 'sm' ? 12 : 16;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        colorClass,
        className
      )}
      {...props}
    >
      <Icon size={iconSize} />
      {formatPercentage(Math.abs(value))}
    </span>
  );
}
