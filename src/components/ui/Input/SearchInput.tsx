import { Search } from 'lucide-react';
import { cn } from '@/utils';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = '検索...',
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'pl-10 pr-4 py-2 border border-border rounded-md w-full',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
        )}
      />
    </div>
  );
}
