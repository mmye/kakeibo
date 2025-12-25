import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryBarChart } from './CategoryBarChart';
import { TransactionProvider, FilterProvider } from '@/contexts';
import * as services from '@/services';
import type { Transaction } from '@/types';

// ResizeObserverのモック
beforeEach(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

vi.mock('@/services', () => ({
  loadTransactions: vi.fn(),
}));

const mockTransactions: Transaction[] = [
  {
    id: 'test-1',
    date: new Date('2025-01-15'),
    description: '食費',
    amount: -30000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-2',
    date: new Date('2025-01-20'),
    description: '日用品',
    amount: -10000,
    institution: 'テスト銀行',
    category: '日用品',
    subcategory: '雑貨',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
];

describe('CategoryBarChart', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('タイトルを表示する', () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    render(<CategoryBarChart />, { wrapper });

    expect(screen.getByText('カテゴリ別支出（棒グラフ）')).toBeInTheDocument();
  });

  it('ChartContainerでラップされている', () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { container } = render(<CategoryBarChart />, { wrapper });

    // ChartContainerのCardが存在する
    expect(container.querySelector('[class*="rounded"]')).toBeInTheDocument();
  });

  it('RechartsのResponsiveContainerがレンダリングされる', () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    render(<CategoryBarChart />, { wrapper });

    // RechartsのResponsiveContainerがレンダリングされる
    const container = document.querySelector('.recharts-responsive-container');
    expect(container).toBeInTheDocument();
  });
});
