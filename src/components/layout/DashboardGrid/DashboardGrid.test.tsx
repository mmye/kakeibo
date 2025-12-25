import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardGrid, GridItem } from './index';

describe('DashboardGrid', () => {
  describe('レンダリング', () => {
    it('子要素をレンダリングする', () => {
      render(
        <DashboardGrid>
          <div>コンテンツ1</div>
          <div>コンテンツ2</div>
        </DashboardGrid>
      );

      expect(screen.getByText('コンテンツ1')).toBeInTheDocument();
      expect(screen.getByText('コンテンツ2')).toBeInTheDocument();
    });

    it('グリッドコンテナとしてレンダリングされる', () => {
      render(
        <DashboardGrid data-testid="grid">
          <div>コンテンツ</div>
        </DashboardGrid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid');
    });
  });

  describe('レスポンシブグリッド', () => {
    it('1カラム（モバイル）クラスを持つ', () => {
      render(
        <DashboardGrid data-testid="grid">
          <div>コンテンツ</div>
        </DashboardGrid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('grid-cols-1');
    });

    it('2カラム（タブレット）クラスを持つ', () => {
      render(
        <DashboardGrid data-testid="grid">
          <div>コンテンツ</div>
        </DashboardGrid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('md:grid-cols-2');
    });

    it('3カラム（デスクトップ）クラスを持つ', () => {
      render(
        <DashboardGrid data-testid="grid">
          <div>コンテンツ</div>
        </DashboardGrid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('lg:grid-cols-3');
    });
  });

  describe('スタイル', () => {
    it('ギャップが設定されている', () => {
      render(
        <DashboardGrid data-testid="grid">
          <div>コンテンツ</div>
        </DashboardGrid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('gap-6');
    });

    it('パディングが設定されている', () => {
      render(
        <DashboardGrid data-testid="grid">
          <div>コンテンツ</div>
        </DashboardGrid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('p-6');
    });

    it('カスタムclassNameを追加できる', () => {
      render(
        <DashboardGrid data-testid="grid" className="custom-class">
          <div>コンテンツ</div>
        </DashboardGrid>
      );

      expect(screen.getByTestId('grid')).toHaveClass('custom-class');
    });
  });
});

describe('GridItem', () => {
  describe('レンダリング', () => {
    it('子要素をレンダリングする', () => {
      render(
        <GridItem>
          <div>アイテムコンテンツ</div>
        </GridItem>
      );

      expect(screen.getByText('アイテムコンテンツ')).toBeInTheDocument();
    });
  });

  describe('colSpan', () => {
    it('colSpan=1の場合はスパンクラスを持たない', () => {
      render(
        <GridItem data-testid="item" colSpan={1}>
          <div>コンテンツ</div>
        </GridItem>
      );

      expect(screen.getByTestId('item')).not.toHaveClass('md:col-span-2');
      expect(screen.getByTestId('item')).not.toHaveClass('lg:col-span-3');
    });

    it('colSpan=2の場合はmd:col-span-2を持つ', () => {
      render(
        <GridItem data-testid="item" colSpan={2}>
          <div>コンテンツ</div>
        </GridItem>
      );

      expect(screen.getByTestId('item')).toHaveClass('md:col-span-2');
    });

    it('colSpan=3の場合はlg:col-span-3を持つ', () => {
      render(
        <GridItem data-testid="item" colSpan={3}>
          <div>コンテンツ</div>
        </GridItem>
      );

      expect(screen.getByTestId('item')).toHaveClass('lg:col-span-3');
    });
  });

  describe('rowSpan', () => {
    it('rowSpan=1の場合はrow-spanクラスを持たない', () => {
      render(
        <GridItem data-testid="item" rowSpan={1}>
          <div>コンテンツ</div>
        </GridItem>
      );

      expect(screen.getByTestId('item')).not.toHaveClass('row-span-2');
    });

    it('rowSpan=2の場合はrow-span-2を持つ', () => {
      render(
        <GridItem data-testid="item" rowSpan={2}>
          <div>コンテンツ</div>
        </GridItem>
      );

      expect(screen.getByTestId('item')).toHaveClass('row-span-2');
    });
  });

  describe('スタイル', () => {
    it('カスタムclassNameを追加できる', () => {
      render(
        <GridItem data-testid="item" className="custom-item">
          <div>コンテンツ</div>
        </GridItem>
      );

      expect(screen.getByTestId('item')).toHaveClass('custom-item');
    });
  });

  describe('colSpanとrowSpanの組み合わせ', () => {
    it('colSpan=2とrowSpan=2を同時に指定できる', () => {
      render(
        <GridItem data-testid="item" colSpan={2} rowSpan={2}>
          <div>コンテンツ</div>
        </GridItem>
      );

      expect(screen.getByTestId('item')).toHaveClass('md:col-span-2');
      expect(screen.getByTestId('item')).toHaveClass('row-span-2');
    });
  });
});
