import { cn } from '@/utils';

type TableRowProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function TableRow({ children, onClick }: TableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-border',
        'hover:bg-background transition-colors',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}
