import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInstitutionSummary } from './useInstitutionSummary';
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
    institution: '三菱UFJ銀行',
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
    institution: '楽天カード',
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
    institution: '三菱UFJ銀行',
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

describe('useInstitutionSummary', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('金融機関別サマリーを返す', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useInstitutionSummary(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBeGreaterThan(0);
    });

    // 三菱UFJ銀行のサマリーを確認（30000 + 10000 = 40000）
    const ufj = result.current.find((s) => s.institution === '三菱UFJ銀行');
    expect(ufj).toBeDefined();
    expect(ufj?.amount).toBe(40000);
  });

  it('金額降順でソートされている', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useInstitutionSummary(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(2); // 三菱UFJ銀行と楽天カード（収入は除外）
    });

    // 金額降順を確認
    expect(result.current[0].institution).toBe('三菱UFJ銀行');
    expect(result.current[0].amount).toBe(40000);
    expect(result.current[1].institution).toBe('楽天カード');
    expect(result.current[1].amount).toBe(20000);
  });

  it('割合を計算する', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useInstitutionSummary(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(2);
    });

    // 割合を確認: 三菱UFJ銀行 40000 / (40000 + 20000) = 0.666...
    const ufj = result.current.find((s) => s.institution === '三菱UFJ銀行');
    expect(ufj?.percentage).toBeCloseTo(40000 / 60000);

    // 楽天カード 20000 / 60000 = 0.333...
    const rakuten = result.current.find((s) => s.institution === '楽天カード');
    expect(rakuten?.percentage).toBeCloseTo(20000 / 60000);
  });
});
