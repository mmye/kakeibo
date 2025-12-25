import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  describe('レンダリング', () => {
    it('子要素を正しくレンダリングする', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('タイトルを表示する', () => {
      render(<Card title="Monthly Income">Content</Card>);
      expect(screen.getByText('Monthly Income')).toBeInTheDocument();
    });

    it('タイトルがない場合は表示しない', () => {
      render(<Card>Content only</Card>);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('スタイル', () => {
    it('基本スタイルが適用される', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-surface');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('shadow-md');
      expect(card).toHaveClass('p-6');
    });

    it('カスタムclassNameを追加できる', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('アクセントカラー', () => {
    it('income アクセントカラーが適用される', () => {
      render(
        <Card accentColor="income" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-l-4');
      expect(card).toHaveClass('border-income');
    });

    it('expense アクセントカラーが適用される', () => {
      render(
        <Card accentColor="expense" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-l-4');
      expect(card).toHaveClass('border-expense');
    });

    it('primary アクセントカラーが適用される', () => {
      render(
        <Card accentColor="primary" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-l-4');
      expect(card).toHaveClass('border-primary');
    });

    it('アクセントカラーがない場合はボーダーなし', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('border-l-4');
    });
  });

  describe('ホバー効果', () => {
    it('ホバー時のシャドウクラスが設定されている', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('hover:shadow-lg');
      expect(card).toHaveClass('transition-shadow');
    });
  });
});
