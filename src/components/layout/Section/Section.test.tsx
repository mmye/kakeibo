import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './index';

describe('Section', () => {
  describe('レンダリング', () => {
    it('section要素としてレンダリングされる', () => {
      render(
        <Section title="テスト">
          <div>コンテンツ</div>
        </Section>
      );

      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('子要素をレンダリングする', () => {
      render(
        <Section title="テスト">
          <div>コンテンツ1</div>
          <div>コンテンツ2</div>
        </Section>
      );

      expect(screen.getByText('コンテンツ1')).toBeInTheDocument();
      expect(screen.getByText('コンテンツ2')).toBeInTheDocument();
    });
  });

  describe('タイトル', () => {
    it('タイトルがh2として表示される', () => {
      render(
        <Section title="セクションタイトル">
          <div>コンテンツ</div>
        </Section>
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('セクションタイトル');
    });

    it('タイトルに適切なスタイルが適用される', () => {
      render(
        <Section title="テスト">
          <div>コンテンツ</div>
        </Section>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-xl');
      expect(heading).toHaveClass('font-bold');
      expect(heading).toHaveClass('text-text-primary');
    });
  });

  describe('説明文', () => {
    it('descriptionが指定されていない場合は説明文が表示されない', () => {
      render(
        <Section title="テスト">
          <div>コンテンツ</div>
        </Section>
      );

      const paragraphs = document.querySelectorAll('p');
      expect(paragraphs.length).toBe(0);
    });

    it('descriptionが指定されている場合は説明文が表示される', () => {
      render(
        <Section title="テスト" description="セクションの説明文です">
          <div>コンテンツ</div>
        </Section>
      );

      expect(screen.getByText('セクションの説明文です')).toBeInTheDocument();
    });

    it('説明文に適切なスタイルが適用される', () => {
      render(
        <Section title="テスト" description="説明文">
          <div>コンテンツ</div>
        </Section>
      );

      const description = screen.getByText('説明文');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('text-text-secondary');
    });
  });

  describe('スタイル', () => {
    it('適切なスペーシングが適用される', () => {
      render(
        <Section title="テスト" data-testid="section">
          <div>コンテンツ</div>
        </Section>
      );

      expect(screen.getByTestId('section')).toHaveClass('space-y-6');
    });

    it('カスタムclassNameを追加できる', () => {
      render(
        <Section title="テスト" className="custom-class" data-testid="section">
          <div>コンテンツ</div>
        </Section>
      );

      expect(screen.getByTestId('section')).toHaveClass('custom-class');
    });
  });

  describe('アクセシビリティ', () => {
    it('section要素にaria-labelledbyが設定される', () => {
      render(
        <Section title="アクセシブルセクション">
          <div>コンテンツ</div>
        </Section>
      );

      const section = screen.getByRole('region');
      const heading = screen.getByRole('heading', { level: 2 });
      expect(section).toHaveAttribute('aria-labelledby', heading.id);
    });
  });
});
