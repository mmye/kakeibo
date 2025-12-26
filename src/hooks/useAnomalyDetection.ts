import { useMemo } from 'react';
import { useTransactionContext } from '@/contexts';
import { detectAnomalies } from '@/utils/calculations';
import type { Anomaly } from '@/types';

/**
 * 異常検知フック
 * 全取引データから異常を検出して返す
 * @returns 取引ID -> 異常リストのMap
 */
export function useAnomalyDetection(): Map<string, Anomaly[]> {
  const { transactions } = useTransactionContext();

  return useMemo(() => {
    if (transactions.length === 0) {
      return new Map<string, Anomaly[]>();
    }

    return detectAnomalies(transactions);
  }, [transactions]);
}
