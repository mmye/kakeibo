import { Card } from '@/components/ui';
import { cn } from '@/utils';
import type { ComponentProps } from 'react';

type ChartContainerProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  height?: number;
  className?: string;
  /** スクリーンリーダー用のチャート説明 */
  'aria-label'?: string;
} & Omit<ComponentProps<typeof Card>, 'children' | 'aria-label'>;

export function ChartContainer({
  title,
  description,
  children,
  height = 400,
  className,
  'aria-label': ariaLabel,
  ...props
}: ChartContainerProps) {
  return (
    <Card className={cn(className)} {...props}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
      </div>
      <div
        style={{ height }}
        role="img"
        aria-label={ariaLabel || title}
        tabIndex={0}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
      >
        {children}
      </div>
    </Card>
  );
}
