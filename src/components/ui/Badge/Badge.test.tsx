import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  describe('レンダリング', () => {
    it('子要素を正しくレンダリングする', () => {
      render(<Badge>食費</Badge>);
      expect(screen.getByText('食費')).toBeInTheDocument();
    });
  });

  describe('variant', () => {
    it('defaultがデフォルトで適用される', () => {
      render(<Badge data-testid="badge">Default</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-gray-100');
      expect(badge).toHaveClass('text-gray-800');
    });

    it('incomeスタイルが適用される', () => {
      render(
        <Badge variant="income" data-testid="badge">
          Income
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-income-light');
      expect(badge).toHaveClass('text-income');
    });

    it('expenseスタイルが適用される', () => {
      render(
        <Badge variant="expense" data-testid="badge">
          Expense
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-expense-light');
      expect(badge).toHaveClass('text-expense');
    });

    it('warningスタイルが適用される', () => {
      render(
        <Badge variant="warning" data-testid="badge">
          Warning
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-warning-light');
      expect(badge).toHaveClass('text-warning');
    });
  });

  describe('size', () => {
    it('mdがデフォルトで適用される', () => {
      render(<Badge data-testid="badge">Medium</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('text-sm');
    });

    it('smサイズが適用される', () => {
      render(
        <Badge size="sm" data-testid="badge">
          Small
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('text-xs');
    });
  });

  describe('スタイル', () => {
    it('基本スタイルが適用される', () => {
      render(<Badge data-testid="badge">Content</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('font-medium');
    });

    it('カスタムclassNameを追加できる', () => {
      render(
        <Badge className="custom-class" data-testid="badge">
          Content
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('custom-class');
    });
  });
});
