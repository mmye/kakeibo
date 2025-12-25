import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './index';

describe('Header', () => {
  describe('レンダリング', () => {
    it('header要素としてレンダリングされる', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('デフォルトタイトルが表示される', () => {
      render(<Header />);
      expect(screen.getByText('家計簿ダッシュボード')).toBeInTheDocument();
    });

    it('カスタムタイトルを表示できる', () => {
      render(<Header title="テストタイトル" />);
      expect(screen.getByText('テストタイトル')).toBeInTheDocument();
    });
  });

  describe('サブタイトル', () => {
    it('サブタイトルが指定されていない場合は表示されない', () => {
      const { container } = render(<Header />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBe(0);
    });

    it('サブタイトルが指定されている場合は表示される', () => {
      render(<Header subtitle="2025年12月" />);
      expect(screen.getByText('2025年12月')).toBeInTheDocument();
    });
  });

  describe('スタイル', () => {
    it('背景色がprimaryになる', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toHaveClass('bg-primary');
    });

    it('テキストが白になる', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toHaveClass('text-white');
    });

    it('タイトルが大きいフォントになる', () => {
      render(<Header />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-2xl');
    });

    it('タイトルが太字になる', () => {
      render(<Header />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('font-bold');
    });
  });
});
