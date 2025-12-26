import { cn } from '@/utils';

type BadgeProps = {
  variant?: 'default' | 'income' | 'expense' | 'warning';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        // variant
        variant === 'default' && 'bg-gray-100 text-gray-800',
        variant === 'income' && 'bg-secondary-light text-secondary',
        variant === 'expense' && 'bg-expense-light text-expense',
        variant === 'warning' && 'bg-warning-light text-warning',
        // size
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-sm',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
