import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartContainer } from './ChartContainer';

describe('ChartContainer', () => {
  it('タイトルを表示する', () => {
    render(
      <ChartContainer title="月別収支推移">
        <div>Chart content</div>
      </ChartContainer>
    );

    expect(screen.getByText('月別収支推移')).toBeInTheDocument();
  });

  it('説明を表示する', () => {
    render(
      <ChartContainer title="月別収支推移" description="2025年の収支推移">
        <div>Chart content</div>
      </ChartContainer>
    );

    expect(screen.getByText('2025年の収支推移')).toBeInTheDocument();
  });

  it('説明がない場合は表示しない', () => {
    render(
      <ChartContainer title="月別収支推移">
        <div>Chart content</div>
      </ChartContainer>
    );

    // 説明要素が存在しないことを確認
    const description = screen.queryByText('2025年の収支推移');
    expect(description).not.toBeInTheDocument();
  });

  it('子要素を表示する', () => {
    render(
      <ChartContainer title="月別収支推移">
        <div data-testid="chart-content">Chart content</div>
      </ChartContainer>
    );

    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('デフォルトの高さは400px', () => {
    render(
      <ChartContainer title="月別収支推移">
        <div>Chart content</div>
      </ChartContainer>
    );

    const chartArea = screen.getByText('Chart content').parentElement;
    expect(chartArea).toHaveStyle({ height: '400px' });
  });

  it('高さを指定できる', () => {
    render(
      <ChartContainer title="月別収支推移" height={300}>
        <div>Chart content</div>
      </ChartContainer>
    );

    const chartArea = screen.getByText('Chart content').parentElement;
    expect(chartArea).toHaveStyle({ height: '300px' });
  });

  it('カスタムclassNameを適用できる', () => {
    render(
      <ChartContainer title="月別収支推移" className="custom-class" data-testid="container">
        <div>Chart content</div>
      </ChartContainer>
    );

    // CardにclassNameが渡されることを確認
    expect(screen.getByTestId('container')).toHaveClass('custom-class');
  });
});
