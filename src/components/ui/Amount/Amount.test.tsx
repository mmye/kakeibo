import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Amount } from './index';

describe('Amount', () => {
  describe('表示形式', () => {
    it('正の金額を符号付きで表示する', () => {
      render(<Amount value={1234} />);
      expect(screen.getByText('+¥1,234')).toBeInTheDocument();
    });

    it('負の金額を符号付きで表示する', () => {
      render(<Amount value={-5678} />);
      expect(screen.getByText('-¥5,678')).toBeInTheDocument();
    });

    it('ゼロを符号なしで表示する', () => {
      render(<Amount value={0} />);
      expect(screen.getByText('¥0')).toBeInTheDocument();
    });

    it('3桁区切りカンマで表示する', () => {
      render(<Amount value={1234567} />);
      expect(screen.getByText('+¥1,234,567')).toBeInTheDocument();
    });
  });

  describe('符号なし表示', () => {
    it('showSign=falseで符号なしの金額を表示する', () => {
      render(<Amount value={1000} showSign={false} />);
      expect(screen.getByText('¥1,000')).toBeInTheDocument();
    });

    it('showSign=falseで負の金額も符号なしで表示する', () => {
      render(<Amount value={-500} showSign={false} />);
      expect(screen.getByText('¥500')).toBeInTheDocument();
    });
  });

  describe('色分け', () => {
    it('正の金額を緑色（text-income）で表示する', () => {
      render(<Amount value={1000} />);
      expect(screen.getByText('+¥1,000')).toHaveClass('text-income');
    });

    it('負の金額を赤色（text-expense）で表示する', () => {
      render(<Amount value={-500} />);
      expect(screen.getByText('-¥500')).toHaveClass('text-expense');
    });

    it('ゼロを通常色で表示する', () => {
      render(<Amount value={0} />);
      expect(screen.getByText('¥0')).toHaveClass('text-text-primary');
    });
  });

  describe('サイズ', () => {
    it('smサイズで小さいフォントを適用する', () => {
      render(<Amount value={100} size="sm" />);
      expect(screen.getByText('+¥100')).toHaveClass('text-sm');
    });

    it('mdサイズで通常フォントを適用する', () => {
      render(<Amount value={100} size="md" />);
      expect(screen.getByText('+¥100')).toHaveClass('text-base');
    });

    it('lgサイズで大きいフォントを適用する', () => {
      render(<Amount value={100} size="lg" />);
      const element = screen.getByText('+¥100');
      expect(element).toHaveClass('text-2xl');
      expect(element).toHaveClass('font-bold');
    });

    it('デフォルトサイズはmd', () => {
      render(<Amount value={100} />);
      expect(screen.getByText('+¥100')).toHaveClass('text-base');
    });
  });

  describe('フォント', () => {
    it('等幅フォントが適用される', () => {
      render(<Amount value={1000} />);
      const element = screen.getByText('+¥1,000');
      expect(element).toHaveClass('font-mono');
      expect(element).toHaveClass('tabular-nums');
    });
  });

  describe('カスタムクラス', () => {
    it('classNameを追加できる', () => {
      render(<Amount value={1000} className="custom-class" />);
      expect(screen.getByText('+¥1,000')).toHaveClass('custom-class');
    });
  });
});
