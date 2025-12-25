import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFilteredData } from './useFilteredData';
import { TransactionProvider, FilterProvider, useFilterContext } from '@/contexts';
import * as services from '@/services';
import type { Transaction } from '@/types';

vi.mock('@/services', () => ({
  loadTransactions: vi.fn(),
}));

const mockTransactions: Transaction[] = [
  {
    id: 'test-1',
    date: new Date('2025-01-15'),
    description: 'テスト取引1',
    amount: -1000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-2',
    date: new Date('2025-02-20'),
    description: 'テスト取引2',
    amount: -2000,
    institution: '楽天カード',
    category: '日用品',
    subcategory: '雑貨',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-3',
    date: new Date('2025-01-25'),
    description: 'テスト取引3',
    amount: 50000,
    institution: 'テスト銀行',
    category: '収入',
    subcategory: '給与',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
];

describe('useFilteredData', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('全データを返す（フィルターなし）', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useFilteredData(), { wrapper });

    await waitFor(() => {
      expect(result.current.data.length).toBe(3);
    });

    expect(result.current.totalCount).toBe(3);
    expect(result.current.filteredCount).toBe(3);
  });

  it('カテゴリでフィルターできる', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(
      () => {
        const filtered = useFilteredData();
        const filter = useFilterContext();
        return { filtered, filter };
      },
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.filtered.data.length).toBe(3);
    });

    act(() => {
      result.current.filter.updateFilter('category', '食費');
    });

    await waitFor(() => {
      expect(result.current.filtered.filteredCount).toBe(1);
    });

    expect(result.current.filtered.data[0]?.category).toBe('食費');
    expect(result.current.filtered.totalCount).toBe(3);
  });

  it('月でフィルターできる', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(
      () => {
        const filtered = useFilteredData();
        const filter = useFilterContext();
        return { filtered, filter };
      },
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.filtered.data.length).toBe(3);
    });

    act(() => {
      result.current.filter.updateFilter('month', 1);
    });

    await waitFor(() => {
      expect(result.current.filtered.filteredCount).toBe(2);
    });

    expect(result.current.filtered.totalCount).toBe(3);
  });
});
