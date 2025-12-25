import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChartData } from './useChartData';
import { TransactionProvider, FilterProvider } from '@/contexts';
import * as services from '@/services';
import type { Transaction } from '@/types';
import { useCallback } from 'react';

vi.mock('@/services', () => ({
  loadTransactions: vi.fn(),
}));

const mockTransactions: Transaction[] = [
  {
    id: 'test-1',
    date: new Date('2025-01-15'),
    description: '食費1',
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

describe('useChartData', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('変換関数でデータを変換する', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    // 件数を返す変換関数
    const transformer = (data: Transaction[]) => data.length;

    const { result } = renderHook(() => useChartData(useCallback(transformer, [])), { wrapper });

    await waitFor(() => {
      expect(result.current).toBe(2);
    });
  });

  it('ジェネリック型で任意の変換結果を返せる', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    type ChartPoint = { label: string; value: number };

    // ChartPoint配列に変換する関数
    const transformer = (data: Transaction[]): ChartPoint[] => {
      return data.map((t) => ({
        label: t.description,
        value: Math.abs(t.amount),
      }));
    };

    const { result } = renderHook(() => useChartData(useCallback(transformer, [])), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(2);
    });

    expect(result.current[0]).toEqual({ label: '食費1', value: 30000 });
    expect(result.current[1]).toEqual({ label: '給与', value: 300000 });
  });

  it('カテゴリ別集計を返せる', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    // カテゴリ別に集計する変換関数
    const transformer = (data: Transaction[]): Record<string, number> => {
      return data.reduce(
        (acc, t) => {
          const category = t.category;
          acc[category] = (acc[category] || 0) + Math.abs(t.amount);
          return acc;
        },
        {} as Record<string, number>
      );
    };

    const { result } = renderHook(() => useChartData(useCallback(transformer, [])), { wrapper });

    await waitFor(() => {
      expect(result.current['食費']).toBe(30000);
    });

    expect(result.current['収入']).toBe(300000);
  });
});
