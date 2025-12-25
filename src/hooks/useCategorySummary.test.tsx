import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCategorySummary } from './useCategorySummary';
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
    description: '食費2',
    amount: -20000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '外食',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-3',
    date: new Date('2025-01-25'),
    description: '日用品',
    amount: -10000,
    institution: 'テスト銀行',
    category: '日用品',
    subcategory: '雑貨',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-4',
    date: new Date('2025-01-25'),
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

describe('useCategorySummary', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('カテゴリ別サマリーを返す', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useCategorySummary(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBeGreaterThan(0);
    });

    // 食費カテゴリを確認
    const food = result.current.find((s) => s.category === '食費');
    expect(food).toBeDefined();
    expect(food?.amount).toBe(50000); // 30000 + 20000
  });

  it('金額降順でソートされている', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useCategorySummary(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(2); // 食費と日用品（収入は除外）
    });

    // 金額降順を確認
    expect(result.current[0]?.category).toBe('食費');
    expect(result.current[0]?.amount).toBe(50000);
    expect(result.current[1]?.category).toBe('日用品');
    expect(result.current[1]?.amount).toBe(10000);
  });

  it('割合を計算する', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useCategorySummary(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(2);
    });

    // 割合を確認
    const food = result.current.find((s) => s.category === '食費');
    expect(food?.percentage).toBeCloseTo(50000 / 60000); // 50000 / (50000 + 10000)
  });
});
