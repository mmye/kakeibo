import { useMemo } from 'react';
import { useFilteredData } from './useFilteredData';
import { calcDailySpending } from '@/utils/calculations';
import type { DailySpendingResult } from '@/types';

/**
 * 日別支出データを計算するフック
 * FilterContextの状態に基づいてフィルタリングされたデータを使用
 * @returns 日別支出データ
 */
export function useDailySpending(): DailySpendingResult {
  const { data } = useFilteredData();

  return useMemo(() => calcDailySpending(data), [data]);
}
