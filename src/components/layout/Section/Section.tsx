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
    <section className={cn('space-y-4', className)} aria-labelledby={headingId} {...props}>
      <div>
        <h2 id={headingId} className="text-xl font-semibold text-text-primary">
          {title}
        </h2>
        {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}
