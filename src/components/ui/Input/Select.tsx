import { cn } from '@/utils';

type SelectProps = {
  label?: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-text-secondary">{label}</label>}
      <select
        className={cn(
          'px-3 py-2 border border-border rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
