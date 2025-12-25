import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTransactions } from './useTransactions';
import { TransactionProvider } from '@/contexts';
import * as services from '@/services';
import type { Transaction } from '@/types';

vi.mock('@/services', () => ({
  loadTransactions: vi.fn(),
}));

const mockTransaction: Transaction = {
  id: 'test-1',
  date: new Date('2025-01-15'),
  description: 'テスト取引',
  amount: -1000,
  institution: 'テスト銀行',
  category: '食費',
  subcategory: '食料品',
  memo: '',
  isTransfer: false,
  isCalculated: true,
};

describe('useTransactions', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>{children}</TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態はローディング中', () => {
    vi.mocked(services.loadTransactions).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useTransactions(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('データ読み込み完了後にトランザクションを返す', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue([mockTransaction]);

    const { result } = renderHook(() => useTransactions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([mockTransaction]);
    expect(result.current.error).toBeNull();
  });

  it('エラー発生時にエラー状態を返す', async () => {
    const error = new Error('読み込みエラー');
    vi.mocked(services.loadTransactions).mockRejectedValue(error);

    const { result } = renderHook(() => useTransactions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toEqual([]);
  });
});
