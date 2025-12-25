import { useTransactionContext } from '@/contexts';
import type { Transaction } from '@/types';

type UseTransactionsReturn = {
  data: Transaction[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * TransactionContext経由でトランザクションデータを取得
 */
export function useTransactions(): UseTransactionsReturn {
  const { transactions, isLoading, error } = useTransactionContext();

  return {
    data: transactions,
    isLoading,
    error,
  };
}
