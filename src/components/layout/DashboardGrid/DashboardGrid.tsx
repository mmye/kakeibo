import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils';

type DashboardGridProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className'>;

/**
 * ダッシュボードのグリッドレイアウトコンポーネント
 * レスポンシブ対応: 1→2→3カラム
 */
export function DashboardGrid({ children, className, ...props }: DashboardGridProps) {
  return (
    <div
      className={cn('grid gap-6 p-6', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}
