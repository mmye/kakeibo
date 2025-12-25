import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTrend } from './useTrend';
import { TransactionProvider, FilterProvider } from '@/contexts';
import * as services from '@/services';
import type { Transaction } from '@/types';

vi.mock('@/services', () => ({
  loadTransactions: vi.fn(),
}));

const mockTransactions: Transaction[] = [
  // 1月のデータ
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
  // 2月のデータ
  {
    id: 'test-3',
    date: new Date('2025-02-15'),
    description: '給与',
    amount: 330000,
    institution: 'テスト銀行',
    category: '収入',
    subcategory: '給与',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-4',
    date: new Date('2025-02-20'),
    description: '食費',
    amount: -33000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
];

describe('useTrend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('月指定時は前月比を返す', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    // 2月を選択した場合、1月との比較
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TransactionProvider>
        <FilterProvider
          initialFilters={{
            year: 2025,
            month: 2,
            category: 'all',
            institution: 'all',
            searchQuery: '',
          }}
        >
          {children}
        </FilterProvider>
      </TransactionProvider>
    );

    const { result } = renderHook(() => useTrend(), { wrapper });

    await waitFor(() => {
      expect(result.current.income).not.toBe(0);
    });

    // 収入: 330000 vs 300000 = +10%
    expect(result.current.income).toBeCloseTo(0.1);
    // 支出: 33000 vs 30000 = +10%
    expect(result.current.expense).toBeCloseTo(0.1);
  });

  it('全期間選択時は0を返す', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TransactionProvider>
        <FilterProvider
          initialFilters={{
            year: 2025,
            month: 'all',
            category: 'all',
            institution: 'all',
            searchQuery: '',
          }}
        >
          {children}
        </FilterProvider>
      </TransactionProvider>
    );

    const { result } = renderHook(() => useTrend(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    expect(result.current.income).toBe(0);
    expect(result.current.expense).toBe(0);
    expect(result.current.balance).toBe(0);
  });

  it('前月データがない場合は0を返す', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    // 1月を選択した場合、前月（12月）のデータがない
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TransactionProvider>
        <FilterProvider
          initialFilters={{
            year: 2025,
            month: 1,
            category: 'all',
            institution: 'all',
            searchQuery: '',
          }}
        >
          {children}
        </FilterProvider>
      </TransactionProvider>
    );

    const { result } = renderHook(() => useTrend(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    // 前月データがないので変化率は0
    expect(result.current.income).toBe(0);
    expect(result.current.expense).toBe(0);
    expect(result.current.balance).toBe(0);
  });
});
