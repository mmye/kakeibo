import { cn } from '@/utils';

type SkeletonProps = {
  /** カスタムクラス */
  className?: string;
  /** スケルトンの形状 */
  variant?: 'text' | 'circular' | 'rectangular';
  /** 幅 */
  width?: string | number;
  /** 高さ */
  height?: string | number;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * ローディング中のスケルトン表示コンポーネント
 */
export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * カード用のスケルトンプリセット
 */
export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-lg shadow-md p-6 space-y-4">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="30%" />
    </div>
  );
}

/**
 * テーブル用のスケルトンプリセット
 */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={48} />
      ))}
    </div>
  );
}
