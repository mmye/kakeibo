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
        // base styles - Cozy Comic pill shape
        'rounded-full font-heading font-bold transition-all duration-200',
        // variant styles
        variant === 'primary' &&
          'bg-primary text-text-primary shadow-sm hover:bg-primary-dark hover:-translate-y-px',
        variant === 'secondary' && 'border border-border text-text-secondary hover:bg-gray-100',
        variant === 'ghost' && 'text-text-secondary hover:bg-gray-100',
        // size styles
        size === 'sm' && 'px-4 py-1.5 text-sm',
        size === 'md' && 'px-6 py-2.5 text-sm',
        size === 'lg' && 'px-8 py-3 text-base',
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
