import { useMemo } from 'react';
import { useFilteredData } from './useFilteredData';
import { calcCategorySummary } from '@/utils/calculations';
import type { CategorySummary } from '@/types';

/**
 * カテゴリ別サマリーを計算
 * @returns カテゴリ別サマリー配列（金額降順）
 */
export function useCategorySummary(): CategorySummary[] {
  const { data } = useFilteredData();

  return useMemo(() => {
    return calcCategorySummary(data);
  }, [data]);
}
