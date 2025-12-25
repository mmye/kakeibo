import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RankingList } from './RankingList';
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
    description: '食料品購入',
    amount: -5000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-2',
    date: new Date('2025-01-16'),
    description: '外食',
    amount: -3000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '外食',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-3',
    date: new Date('2025-01-17'),
    description: '電車代',
    amount: -1000,
    institution: 'テスト銀行',
    category: '交通費',
    subcategory: '電車',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
];

describe('RankingList', () => {
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
    render(<RankingList />, { wrapper });
    expect(await screen.findByText('支出ランキング TOP10')).toBeInTheDocument();
  });

  it('ランキング順位が表示される', async () => {
    render(<RankingList />, { wrapper });
    expect(await screen.findByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('中項目名が表示される', async () => {
    render(<RankingList />, { wrapper });
    expect(await screen.findByText('食料品')).toBeInTheDocument();
  });

  it('金額がフォーマットされて表示される', async () => {
    render(<RankingList limit={5} />, { wrapper });
    // 負の金額として表示
    expect(await screen.findByText('-¥5,000')).toBeInTheDocument();
  });
});
