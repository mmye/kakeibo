import { cn } from '@/utils';

type TableRowProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function TableRow({ children, onClick }: TableRowProps) {
  return (
    <tr
      className={cn(
        'h-14 border-b border-border',
        'even:bg-surface-hover',
        'hover:bg-background transition-colors',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}
