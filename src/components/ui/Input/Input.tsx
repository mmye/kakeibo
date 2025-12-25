import { cn } from '@/utils';

type InputProps = {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-text-secondary">{label}</label>}
      <input
        className={cn(
          'px-3 py-2 border border-border rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          error && 'border-expense',
          className
        )}
        {...props}
      />
      {error && <span className="text-sm text-expense">{error}</span>}
    </div>
  );
}
