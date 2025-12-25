import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HighExpenseList } from './HighExpenseList';
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
    description: '高額商品A',
    amount: -50000,
    institution: 'テスト銀行',
    category: '衣服美容',
    subcategory: '洋服',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-2',
    date: new Date('2025-01-16'),
    description: '高額商品B',
    amount: -30000,
    institution: 'テスト銀行',
    category: '健康医療',
    subcategory: '医療費',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-3',
    date: new Date('2025-01-17'),
    description: '低額商品',
    amount: -1000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
];

describe('HighExpenseList', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);
  });

  it('タイトルが表示される', async () => {
    render(<HighExpenseList />, { wrapper });
    expect(await screen.findByText('高額支出')).toBeInTheDocument();
  });

  it('閾値を超える高額支出のみ表示される', async () => {
    render(<HighExpenseList threshold={10000} />, { wrapper });
    expect(await screen.findByText('高額商品A')).toBeInTheDocument();
    expect(screen.getByText('高額商品B')).toBeInTheDocument();
    expect(screen.queryByText('低額商品')).not.toBeInTheDocument();
  });

  it('金額がフォーマットされて表示される', async () => {
    render(<HighExpenseList threshold={10000} />, { wrapper });
    expect(await screen.findByText('-¥50,000')).toBeInTheDocument();
  });

  it('日付とカテゴリが表示される', async () => {
    render(<HighExpenseList threshold={10000} />, { wrapper });
    await screen.findByText('高額商品A');
    expect(screen.getByText(/衣服美容/)).toBeInTheDocument();
  });
});
