import { cn } from '@/utils';

type TableCellProps = {
  children: React.ReactNode;
  header?: boolean;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
  onClick?: () => void;
  className?: string;
};

export function TableCell({
  children,
  header = false,
  align = 'left',
  numeric = false,
  onClick,
  className,
}: TableCellProps) {
  const Component = header ? 'th' : 'td';
  return (
    <Component
      className={cn(
        'px-4 py-4',
        header && 'text-text-secondary text-xs font-semibold uppercase tracking-wider',
        !header && 'text-sm',
        numeric && 'font-number',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
