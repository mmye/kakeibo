import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon, CategoryIcon } from './index';

describe('Icon', () => {
  describe('レンダリング', () => {
    it('アイコンを正しくレンダリングする', () => {
      render(<Icon name="camera" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('SVG要素としてレンダリングされる', () => {
      render(<Icon name="heart" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon.tagName.toLowerCase()).toBe('svg');
    });
  });

  describe('サイズ', () => {
    it('smサイズで16pxになる', () => {
      render(<Icon name="camera" size="sm" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('width', '16');
      expect(icon).toHaveAttribute('height', '16');
    });

    it('mdサイズで20pxになる', () => {
      render(<Icon name="camera" size="md" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
    });

    it('lgサイズで24pxになる', () => {
      render(<Icon name="camera" size="lg" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
    });

    it('xlサイズで32pxになる', () => {
      render(<Icon name="camera" size="xl" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('width', '32');
      expect(icon).toHaveAttribute('height', '32');
    });

    it('デフォルトサイズはmd(20px)になる', () => {
      render(<Icon name="camera" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
    });
  });

  describe('カラー', () => {
    it('color propsで色を指定できる', () => {
      render(<Icon name="camera" color="#FF0000" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      // Lucide iconsはcolorをstroke属性として適用する
      expect(icon).toHaveAttribute('stroke', '#FF0000');
    });
  });

  describe('カスタムクラス', () => {
    it('classNameを追加できる', () => {
      render(<Icon name="camera" className="custom-class" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass('custom-class');
    });
  });

  describe('存在しないアイコン', () => {
    it('存在しないアイコン名の場合はフォールバックアイコンを表示', () => {
      render(<Icon name="nonexistent-icon" data-testid="icon" />);
      // more-horizontal (MoreHorizontal) がフォールバックとして表示される
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });
});

describe('CategoryIcon', () => {
  describe('レンダリング', () => {
    it('カテゴリに対応するアイコンを表示する', () => {
      render(<CategoryIcon category="食費" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('色', () => {
    it('カテゴリに対応する色が適用される', () => {
      render(<CategoryIcon category="食費" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      // 食費の色は #F59E0B (stroke属性として適用される)
      expect(icon).toHaveAttribute('stroke', '#F59E0B');
    });

    it('交通費カテゴリで青色が適用される', () => {
      render(<CategoryIcon category="交通費" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      // 交通費の色は #3B82F6 (stroke属性として適用される)
      expect(icon).toHaveAttribute('stroke', '#3B82F6');
    });

    it('未知のカテゴリではデフォルト色が適用される', () => {
      render(<CategoryIcon category="不明なカテゴリ" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      // その他の色は #6B7280 (stroke属性として適用される)
      expect(icon).toHaveAttribute('stroke', '#6B7280');
    });
  });

  describe('サイズ', () => {
    it('sizeプロップでサイズを指定できる', () => {
      render(<CategoryIcon category="食費" size="lg" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
    });

    it('デフォルトサイズはmd', () => {
      render(<CategoryIcon category="食費" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
    });
  });

  describe('カスタムクラス', () => {
    it('classNameを追加できる', () => {
      render(<CategoryIcon category="食費" className="custom-class" data-testid="icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass('custom-class');
    });
  });

  describe('各カテゴリ', () => {
    const categories = [
      '食費',
      '日用品',
      '交通費',
      '通信費',
      '教養・教育',
      '健康・医療',
      '衣服・美容',
      '趣味・娯楽',
      '水道・光熱費',
      '交際費',
      'その他',
      '収入',
    ];

    categories.forEach((category) => {
      it(`${category}のアイコンが表示される`, () => {
        render(<CategoryIcon category={category} data-testid="icon" />);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
      });
    });
  });
});
