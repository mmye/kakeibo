import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, renderHook } from '@testing-library/react';
import { TransactionProvider, useTransactionContext } from './TransactionContext';
import * as services from '@/services';
import type { Transaction } from '@/types';

// Mock loadTransactions
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

describe('TransactionContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TransactionProvider', () => {
    it('子要素をレンダリングする', async () => {
      vi.mocked(services.loadTransactions).mockResolvedValue([]);

      render(
        <TransactionProvider>
          <div>テスト子要素</div>
        </TransactionProvider>
      );

      expect(screen.getByText('テスト子要素')).toBeInTheDocument();
    });

    it('初期ロード時にloadTransactionsを呼び出す', async () => {
      vi.mocked(services.loadTransactions).mockResolvedValue([mockTransaction]);

      render(
        <TransactionProvider>
          <div>テスト</div>
        </TransactionProvider>
      );

      await waitFor(() => {
        expect(services.loadTransactions).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('useTransactionContext', () => {
    it('初期状態はローディング中', () => {
      vi.mocked(services.loadTransactions).mockReturnValue(
        new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useTransactionContext(), {
        wrapper: TransactionProvider,
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.transactions).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('データ読み込み完了後にトランザクションを返す', async () => {
      vi.mocked(services.loadTransactions).mockResolvedValue([mockTransaction]);

      const { result } = renderHook(() => useTransactionContext(), {
        wrapper: TransactionProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.transactions).toEqual([mockTransaction]);
      expect(result.current.error).toBeNull();
    });

    it('エラー発生時にエラー状態を設定する', async () => {
      const error = new Error('読み込みエラー');
      vi.mocked(services.loadTransactions).mockRejectedValue(error);

      const { result } = renderHook(() => useTransactionContext(), {
        wrapper: TransactionProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.transactions).toEqual([]);
    });

    it('reload関数で再読み込みできる', async () => {
      vi.mocked(services.loadTransactions)
        .mockResolvedValueOnce([mockTransaction])
        .mockResolvedValueOnce([mockTransaction, { ...mockTransaction, id: 'test-2' }]);

      const { result } = renderHook(() => useTransactionContext(), {
        wrapper: TransactionProvider,
      });

      await waitFor(() => {
        expect(result.current.transactions).toHaveLength(1);
      });

      await result.current.reload();

      await waitFor(() => {
        expect(result.current.transactions).toHaveLength(2);
      });

      expect(services.loadTransactions).toHaveBeenCalledTimes(2);
    });

    it('Provider外で使用時にエラーをスローする', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTransactionContext());
      }).toThrow('useTransactionContext must be used within TransactionProvider');

      consoleSpy.mockRestore();
    });
  });
});
