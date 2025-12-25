import { cn } from '@/utils';

type TableCellProps = {
  children: React.ReactNode;
  header?: boolean;
  align?: 'left' | 'center' | 'right';
};

export function TableCell({ children, header = false, align = 'left' }: TableCellProps) {
  const Component = header ? 'th' : 'td';
  return (
    <Component
      className={cn(
        'px-4 py-3',
        header && 'text-text-secondary text-xs font-semibold uppercase tracking-wider',
        !header && 'text-sm',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right'
      )}
    >
      {children}
    </Component>
  );
}
