import { useMemo } from 'react';
import { useTransactionContext, useFilterContext } from '@/contexts';
import { applyFilters } from '@/utils/filters';
import type { Transaction } from '@/types';

type UseFilteredDataReturn = {
  data: Transaction[];
  totalCount: number;
  filteredCount: number;
};

/**
 * フィルター適用済みデータを取得
 */
export function useFilteredData(): UseFilteredDataReturn {
  const { transactions } = useTransactionContext();
  const { filters } = useFilterContext();

  const filteredData = useMemo(() => {
    return applyFilters(transactions, filters);
  }, [transactions, filters]);

  return {
    data: filteredData,
    totalCount: transactions.length,
    filteredCount: filteredData.length,
  };
}
