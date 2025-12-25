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
} & React.HTMLAttributes<HTMLDivElement>;

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
        'bg-surface rounded-lg shadow-md',
        'hover:shadow-lg transition-shadow',
        size === 'default' && 'p-6',
        size === 'large' && 'p-8',
        accentColor === 'income' && 'border-l-4 border-income',
        accentColor === 'expense' && 'border-l-4 border-expense',
        accentColor === 'primary' && 'border-l-4 border-primary',
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
