import { useId, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils';

type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'className'>;

/**
 * セクション区切りコンポーネント
 * タイトル、説明文、コンテンツをまとめて表示
 */
export function Section({ title, description, children, className, ...props }: SectionProps) {
  const headingId = useId();

  return (
    <section className={cn('space-y-6', className)} aria-labelledby={headingId} {...props}>
      <div className="flex items-center gap-3 pb-3 border-b-2 border-border">
        <div className="w-1.5 h-7 bg-primary rounded-sm" />
        <div>
          <h2 id={headingId} className="text-xl font-bold text-text-primary">
            {title}
          </h2>
          {description && <p className="text-sm text-text-secondary mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
