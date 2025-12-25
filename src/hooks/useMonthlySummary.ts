import { useMemo } from 'react';
import { useFilteredData } from './useFilteredData';
import { calcMonthlySummary } from '@/utils/calculations';
import type { MonthlySummary } from '@/types';

/**
 * 月別サマリーを計算
 * @returns 月別サマリー配列（1月〜12月）
 */
export function useMonthlySummary(): MonthlySummary[] {
  const { data } = useFilteredData();

  return useMemo(() => {
    return calcMonthlySummary(data);
  }, [data]);
}
