import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

type CardProps = {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  accentColor?: 'income' | 'expense' | 'primary';
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({ title, icon: Icon, children, className, accentColor, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-lg shadow-md p-6',
        'hover:shadow-lg transition-shadow',
        accentColor === 'income' && 'border-l-4 border-income',
        accentColor === 'expense' && 'border-l-4 border-expense',
        accentColor === 'primary' && 'border-l-4 border-primary',
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="text-text-secondary text-sm font-medium mb-2 flex items-center gap-2">
          {Icon && (
            <Icon
              size={16}
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
