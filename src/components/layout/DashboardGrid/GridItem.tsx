import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils';

type GridItemProps = {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className'>;

/**
 * グリッドアイテムコンポーネント
 * colSpan/rowSpanでグリッドスパンを指定可能
 */
export function GridItem({
  children,
  colSpan = 1,
  rowSpan = 1,
  className,
  ...props
}: GridItemProps) {
  return (
    <div
      className={cn(
        colSpan === 2 && 'md:col-span-2',
        colSpan === 3 && 'lg:col-span-3',
        rowSpan === 2 && 'row-span-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
