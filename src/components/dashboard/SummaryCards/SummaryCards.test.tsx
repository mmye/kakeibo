import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCards } from './SummaryCards';
import { TransactionProvider, FilterProvider } from '@/contexts';
import * as services from '@/services';
import type { Transaction } from '@/types';

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
    description: '食費',
    amount: -30000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
];

describe('SummaryCards', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);
  });

  it('収入カードを表示する', () => {
    render(<SummaryCards />, { wrapper });
    expect(screen.getByText('月間収入')).toBeInTheDocument();
  });

  it('支出カードを表示する', () => {
    render(<SummaryCards />, { wrapper });
    expect(screen.getByText('月間支出')).toBeInTheDocument();
  });

  it('収支カードを表示する', () => {
    render(<SummaryCards />, { wrapper });
    expect(screen.getByText('収支バランス')).toBeInTheDocument();
  });

  it('3つのカードがグリッドでレイアウトされる', () => {
    const { container } = render(<SummaryCards />, { wrapper });
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });
});
