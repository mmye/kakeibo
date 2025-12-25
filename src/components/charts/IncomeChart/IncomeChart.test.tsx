import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncomeChart } from './IncomeChart';
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
    description: '給与',
    amount: 300000,
    institution: 'テスト銀行',
    category: '収入',
    subcategory: '給与',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-2',
    date: new Date('2025-01-20'),
    description: 'ポイント',
    amount: 5000,
    institution: 'テスト銀行',
    category: '収入',
    subcategory: 'ポイント',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
];

describe('IncomeChart', () => {
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

    render(<IncomeChart />, { wrapper });

    expect(screen.getByText('収入源の内訳')).toBeInTheDocument();
  });

  it('ChartContainerでラップされている', () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { container } = render(<IncomeChart />, { wrapper });

    expect(container.querySelector('[class*="rounded"]')).toBeInTheDocument();
  });

  it('RechartsのResponsiveContainerがレンダリングされる', () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    render(<IncomeChart />, { wrapper });

    const container = document.querySelector('.recharts-responsive-container');
    expect(container).toBeInTheDocument();
  });
});
