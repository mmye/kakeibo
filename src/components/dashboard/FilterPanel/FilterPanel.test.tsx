import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterPanel } from './FilterPanel';
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
];

describe('FilterPanel', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);
  });

  it('年フィルターが表示される', () => {
    render(<FilterPanel />, { wrapper });
    expect(screen.getByText('年')).toBeInTheDocument();
  });

  it('月フィルターが表示される', () => {
    render(<FilterPanel />, { wrapper });
    expect(screen.getByText('月')).toBeInTheDocument();
  });

  it('カテゴリフィルターが表示される', () => {
    render(<FilterPanel />, { wrapper });
    expect(screen.getByText('カテゴリ')).toBeInTheDocument();
  });

  it('金融機関フィルターが表示される', () => {
    render(<FilterPanel />, { wrapper });
    expect(screen.getByText('金融機関')).toBeInTheDocument();
  });

  it('検索入力が表示される', () => {
    render(<FilterPanel />, { wrapper });
    expect(screen.getByPlaceholderText('内容を検索...')).toBeInTheDocument();
  });
});
