import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

type CardProps = {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  accentColor?: 'income' | 'expense' | 'primary';
  /** カードサイズ（largeは大きなパディング） */
  size?: 'default' | 'large';
  /** 背景色を薄く強調表示 */
  highlighted?: boolean;
  /** アクセシビリティ用のラベル（titleと異なる説明が必要な場合） */
  'aria-label'?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'aria-label'>;

export function Card({
  title,
  icon: Icon,
  children,
  className,
  accentColor,
  size = 'default',
  highlighted = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-lg border border-border',
        'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]',
        'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
        size === 'default' && 'p-6',
        size === 'large' && 'p-8',
        accentColor === 'income' && 'border-l-4 border-l-income',
        accentColor === 'expense' && 'border-l-4 border-l-expense',
        accentColor === 'primary' && 'border-l-4 border-l-primary',
        highlighted && accentColor === 'income' && 'bg-income-light',
        highlighted && accentColor === 'expense' && 'bg-expense-light',
        highlighted && accentColor === 'primary' && 'bg-primary/5',
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="text-text-secondary text-sm font-medium mb-2 flex items-center gap-2">
          {Icon && (
            <Icon
              size={size === 'large' ? 20 : 16}
              className={cn(
                accentColor === 'income' && 'text-income',
                accentColor === 'expense' && 'text-expense',
                accentColor === 'primary' && 'text-primary'
              )}
            />
          )}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
