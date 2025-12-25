import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMonthlySummary } from './useMonthlySummary';
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
  {
    id: 'test-3',
    date: new Date('2025-02-15'),
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
    id: 'test-4',
    date: new Date('2025-02-20'),
    description: '日用品',
    amount: -15000,
    institution: 'テスト銀行',
    category: '日用品',
    subcategory: '雑貨',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
];

describe('useMonthlySummary', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('月別サマリーを返す', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useMonthlySummary(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBeGreaterThan(0);
    });

    // 1月のサマリー確認
    const jan = result.current.find((s) => s.month === '1月');
    expect(jan).toBeDefined();
    expect(jan?.income).toBe(300000);
    expect(jan?.expense).toBe(30000);
    expect(jan?.balance).toBe(270000);
  });

  it('データが存在する月のみサマリーを返す', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useMonthlySummary(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBeGreaterThan(0);
    });

    // 2月のサマリー確認
    const feb = result.current.find((s) => s.month === '2月');
    expect(feb).toBeDefined();
    expect(feb?.income).toBe(300000);
    expect(feb?.expense).toBe(15000);
  });

  it('月順にソートされている', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useMonthlySummary(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(2); // 1月と2月
    });

    expect(result.current[0]?.month).toBe('1月');
    expect(result.current[1]?.month).toBe('2月');
  });
});
