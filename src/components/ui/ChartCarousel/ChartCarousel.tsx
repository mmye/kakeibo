import { useState, useCallback, useEffect, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils';

type ChartCarouselProps = {
  children: ReactNode[];
  className?: string;
};

/**
 * モバイル向けチャートカルーセル
 * - モバイル(<md): カルーセル表示（スワイプ切替）
 * - デスクトップ(>=md): グリッド表示
 */
export function ChartCarousel({ children, className }: ChartCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const canScrollPrev = selectedIndex > 0;
  const canScrollNext = selectedIndex < scrollSnaps.length - 1;

  return (
    <div className={cn('relative', className)}>
      {/* モバイル: カルーセル表示 */}
      <div className="md:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {children.map((child, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              'p-2 rounded-full transition-colors',
              canScrollPrev
                ? 'bg-border hover:bg-border-strong text-text-primary'
                : 'text-text-tertiary cursor-not-allowed'
            )}
            aria-label="前のグラフ"
          >
            <ChevronLeft size={20} />
          </button>

          {/* ドットインジケーター */}
          <div className="flex gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-colors',
                  index === selectedIndex ? 'bg-primary' : 'bg-border hover:bg-border-strong'
                )}
                aria-label={`グラフ ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              'p-2 rounded-full transition-colors',
              canScrollNext
                ? 'bg-border hover:bg-border-strong text-text-primary'
                : 'text-text-tertiary cursor-not-allowed'
            )}
            aria-label="次のグラフ"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* スライド番号 */}
        <p className="text-center text-sm text-text-secondary mt-2">
          {selectedIndex + 1} / {children.length}
        </p>
      </div>

      {/* デスクトップ: グリッド表示 */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
    </div>
  );
}
