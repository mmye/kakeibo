import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, SkeletonCard, SkeletonTable } from './index';

describe('Skeleton', () => {
  describe('レンダリング', () => {
    it('スケルトンを正しくレンダリングする', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('div要素としてレンダリングされる', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton').tagName.toLowerCase()).toBe('div');
    });
  });

  describe('アニメーション', () => {
    it('animate-pulseクラスが適用される', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
    });

    it('bg-gray-200クラスが適用される', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('bg-gray-200');
    });
  });

  describe('variant', () => {
    it('textバリアントでh-4とroundedが適用される', () => {
      render(<Skeleton variant="text" data-testid="skeleton" />);
      const el = screen.getByTestId('skeleton');
      expect(el).toHaveClass('h-4');
      expect(el).toHaveClass('rounded');
    });

    it('circularバリアントでrounded-fullが適用される', () => {
      render(<Skeleton variant="circular" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('rounded-full');
    });

    it('rectangularバリアントでrounded-lgが適用される', () => {
      render(<Skeleton variant="rectangular" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('rounded-lg');
    });

    it('デフォルトはtextバリアント', () => {
      render(<Skeleton data-testid="skeleton" />);
      const el = screen.getByTestId('skeleton');
      expect(el).toHaveClass('h-4');
      expect(el).toHaveClass('rounded');
    });
  });

  describe('サイズ', () => {
    it('widthを数値で指定できる', () => {
      render(<Skeleton width={100} data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveStyle({ width: '100px' });
    });

    it('widthを文字列で指定できる', () => {
      render(<Skeleton width="50%" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveStyle({ width: '50%' });
    });

    it('heightを数値で指定できる', () => {
      render(<Skeleton height={32} data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveStyle({ height: '32px' });
    });

    it('heightを文字列で指定できる', () => {
      render(<Skeleton height="2rem" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveStyle({ height: '2rem' });
    });
  });

  describe('カスタムクラス', () => {
    it('classNameを追加できる', () => {
      render(<Skeleton className="custom-class" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('custom-class');
    });
  });
});

describe('SkeletonCard', () => {
  it('カードスケルトンをレンダリングする', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.bg-surface')).toBeInTheDocument();
    expect(container.querySelector('.shadow-md')).toBeInTheDocument();
  });

  it('複数のSkeletonを含む', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe('SkeletonTable', () => {
  it('デフォルトで5行のスケルトンをレンダリングする', () => {
    const { container } = render(<SkeletonTable />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(5);
  });

  it('rowsプロップで行数を指定できる', () => {
    const { container } = render(<SkeletonTable rows={3} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('rectangularバリアントのスケルトンが含まれる', () => {
    const { container } = render(<SkeletonTable rows={1} />);
    const skeleton = container.querySelector('.rounded-lg');
    expect(skeleton).toBeInTheDocument();
  });
});
