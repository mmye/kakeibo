import { cn } from '@/utils';
import { formatCurrency, formatAmount } from '@/utils/formatters';

type AmountProps = {
  /** 金額（正: 収入、負: 支出） */
  value: number;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 符号を表示するか（デフォルト: true） */
  showSign?: boolean;
  /** カスタムクラス */
  className?: string;
};

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl font-bold',
  xl: 'text-3xl font-bold tracking-tight',
} as const;

/**
 * 金額表示コンポーネント
 * 収入は青（Blanket Blue）、支出は赤（Sally Rose）で表示する
 * スクリーンリーダー向けに金額の種別（収入/支出）を読み上げる
 */
export function Amount({ value, size = 'md', showSign = true, className }: AmountProps) {
  const formatted = showSign ? formatCurrency(value) : formatAmount(value);
  const colorClass = value > 0 ? 'text-income' : value < 0 ? 'text-expense' : 'text-text-primary';

  // スクリーンリーダー用のラベル
  const ariaLabel =
    value > 0 ? `収入 ${formatted}` : value < 0 ? `支出 ${formatted}` : `金額 ${formatted}`;

  return (
    <span
      className={cn('font-number tabular-nums', sizeClasses[size], colorClass, className)}
      aria-label={ariaLabel}
      role="text"
    >
      {formatted}
    </span>
  );
}
