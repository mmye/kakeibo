import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrendIndicator } from './index';

describe('TrendIndicator', () => {
  describe('表示形式', () => {
    it('正の変化率をパーセントで表示する', () => {
      render(<TrendIndicator value={0.052} data-testid="trend" />);
      expect(screen.getByText('5.2%')).toBeInTheDocument();
    });

    it('負の変化率をパーセントで表示する', () => {
      render(<TrendIndicator value={-0.123} data-testid="trend" />);
      expect(screen.getByText('12.3%')).toBeInTheDocument();
    });

    it('ゼロをパーセントで表示する', () => {
      render(<TrendIndicator value={0} data-testid="trend" />);
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });
  });

  describe('アイコン', () => {
    it('正の変化率で上向きアイコンが表示される', () => {
      const { container } = render(<TrendIndicator value={0.1} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('負の変化率で下向きアイコンが表示される', () => {
      const { container } = render(<TrendIndicator value={-0.1} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('ゼロで横線アイコンが表示される', () => {
      const { container } = render(<TrendIndicator value={0} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('色分け（positiveIsGood=true: 増加が良い）', () => {
    it('正の変化率を緑色で表示する', () => {
      render(<TrendIndicator value={0.1} positiveIsGood={true} data-testid="trend" />);
      expect(screen.getByTestId('trend')).toHaveClass('text-income');
    });

    it('負の変化率を赤色で表示する', () => {
      render(<TrendIndicator value={-0.1} positiveIsGood={true} data-testid="trend" />);
      expect(screen.getByTestId('trend')).toHaveClass('text-expense');
    });

    it('ゼロをグレーで表示する', () => {
      render(<TrendIndicator value={0} data-testid="trend" />);
      expect(screen.getByTestId('trend')).toHaveClass('text-text-secondary');
    });
  });

  describe('色分け（positiveIsGood=false: 増加が悪い、支出など）', () => {
    it('正の変化率を赤色で表示する', () => {
      render(<TrendIndicator value={0.1} positiveIsGood={false} data-testid="trend" />);
      expect(screen.getByTestId('trend')).toHaveClass('text-expense');
    });

    it('負の変化率を緑色で表示する', () => {
      render(<TrendIndicator value={-0.1} positiveIsGood={false} data-testid="trend" />);
      expect(screen.getByTestId('trend')).toHaveClass('text-income');
    });
  });

  describe('サイズ', () => {
    it('smサイズで小さいフォントを適用する', () => {
      render(<TrendIndicator value={0.1} size="sm" data-testid="trend" />);
      expect(screen.getByTestId('trend')).toHaveClass('text-xs');
    });

    it('mdサイズで通常フォントを適用する', () => {
      render(<TrendIndicator value={0.1} size="md" data-testid="trend" />);
      expect(screen.getByTestId('trend')).toHaveClass('text-sm');
    });

    it('デフォルトサイズはmd', () => {
      render(<TrendIndicator value={0.1} data-testid="trend" />);
      expect(screen.getByTestId('trend')).toHaveClass('text-sm');
    });
  });

  describe('smサイズのアイコン', () => {
    it('smサイズで12pxのアイコンが表示される', () => {
      const { container } = render(<TrendIndicator value={0.1} size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '12');
      expect(svg).toHaveAttribute('height', '12');
    });

    it('mdサイズで16pxのアイコンが表示される', () => {
      const { container } = render(<TrendIndicator value={0.1} size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
    });
  });

  describe('カスタムクラス', () => {
    it('classNameを追加できる', () => {
      render(<TrendIndicator value={0.1} className="custom-class" data-testid="trend" />);
      expect(screen.getByTestId('trend')).toHaveClass('custom-class');
    });
  });
});
