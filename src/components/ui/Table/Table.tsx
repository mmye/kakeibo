import { cn } from '@/utils';

type TableProps = {
  children: React.ReactNode;
  className?: string;
};

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full', className)}>{children}</table>
    </div>
  );
}
