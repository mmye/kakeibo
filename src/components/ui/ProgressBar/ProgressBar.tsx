import { cn } from '@/utils';

type ProgressBarProps = {
  /** 現在の値 */
  value: number;
  /** 最大値（デフォルト: 100） */
  max?: number;
  /** 警告閾値（パーセント、デフォルト: 80） */
  warningThreshold?: number;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** ラベル表示 */
  showLabel?: boolean;
  /** カスタムラベル */
  label?: string;
  className?: string;
};

/**
 * 進捗バーコンポーネント
 * 予算の進捗状況を視覚化
 * - 50%未満: 緑（安全）
 * - 50-80%: 黄（注意）
 * - 80-100%: オレンジ（警告）
 * - 100%超: 赤（超過）
 */
export function ProgressBar({
  value,
  max = 100,
  warningThreshold = 80,
  size = 'md',
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const isOverBudget = value > max;
  const actualPercentage = (value / max) * 100;

  // 進捗率に応じた色を決定
  const getBarColor = () => {
    if (isOverBudget) {
      return 'bg-expense';
    } // 赤
    if (actualPercentage >= warningThreshold) {
      return 'bg-warning';
    } // オレンジ
    if (actualPercentage >= 50) {
      return 'bg-primary';
    } // 黄
    return 'bg-income'; // 緑
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const displayLabel = label ?? `${Math.round(actualPercentage)}%`;

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-border/50 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', getBarColor())}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span
            className={cn(
              'text-xs',
              isOverBudget ? 'text-expense font-medium' : 'text-text-secondary'
            )}
          >
            {displayLabel}
          </span>
          {isOverBudget && <span className="text-xs text-expense font-medium">予算超過!</span>}
        </div>
      )}
    </div>
  );
}
