import { X } from 'lucide-react';
import { cn } from '@/utils';

type FilterChipProps = {
  label: string;
  value: string;
  onRemove: () => void;
  className?: string;
};

/**
 * フィルターチップ
 * 適用中のフィルターを表示し、×ボタンで解除
 */
export function FilterChip({ label, value, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
        'bg-primary/10 text-primary text-sm font-medium',
        'transition-colors',
        className
      )}
    >
      <span className="text-text-secondary text-xs">{label}:</span>
      <span>{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          'ml-0.5 p-0.5 rounded-full',
          'hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50',
          'transition-colors'
        )}
        aria-label={`${label}フィルターを解除`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}
