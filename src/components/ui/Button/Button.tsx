import { cn } from '@/utils';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // base styles
        'rounded-md font-semibold transition-all',
        // variant styles
        variant === 'primary' && 'bg-primary text-white hover:bg-primary-light',
        variant === 'secondary' && 'border border-primary text-primary hover:bg-primary/10',
        variant === 'ghost' && 'text-primary hover:bg-primary/5',
        // size styles
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        // disabled
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
