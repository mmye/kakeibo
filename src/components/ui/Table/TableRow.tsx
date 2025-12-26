import { cn } from '@/utils';

type TableRowProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function TableRow({ children, onClick, className }: TableRowProps) {
  return (
    <tr
      className={cn(
        'h-14 border-b border-border',
        'even:bg-surface-hover',
        'hover:bg-background transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}
