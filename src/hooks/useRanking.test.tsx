import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRanking } from './useRanking';
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
    description: '食料品1',
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
    description: '外食1',
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
    description: '雑貨',
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

describe('useRanking', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('中項目別ランキングを返す', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useRanking(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBeGreaterThan(0);
    });

    // ランキング1位は食料品（30000）
    expect(result.current[0].subcategory).toBe('食料品');
    expect(result.current[0].amount).toBe(30000);
    expect(result.current[0].rank).toBe(1);
  });

  it('金額降順でランクが付与される', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useRanking(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(3); // 食料品、外食、雑貨
    });

    // ランキング順を確認
    expect(result.current[0].rank).toBe(1);
    expect(result.current[0].subcategory).toBe('食料品');
    expect(result.current[1].rank).toBe(2);
    expect(result.current[1].subcategory).toBe('外食');
    expect(result.current[2].rank).toBe(3);
    expect(result.current[2].subcategory).toBe('雑貨');
  });

  it('limitで取得件数を制限できる', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useRanking(2), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(2);
    });

    // 上位2件のみ取得
    expect(result.current[0].subcategory).toBe('食料品');
    expect(result.current[1].subcategory).toBe('外食');
  });

  it('割合を計算する', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useRanking(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(3);
    });

    // 食料品: 30000 / (30000 + 20000 + 10000) = 0.5
    expect(result.current[0].percentage).toBeCloseTo(0.5);
  });
});
