import { Card } from '@/components/ui';
import { cn } from '@/utils';
import type { ComponentProps } from 'react';

type ChartContainerProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  height?: number;
  className?: string;
} & Omit<ComponentProps<typeof Card>, 'children'>;

export function ChartContainer({
  title,
  description,
  children,
  height = 400,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <Card className={cn(className)} {...props}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
      </div>
      <div style={{ height }}>{children}</div>
    </Card>
  );
}
