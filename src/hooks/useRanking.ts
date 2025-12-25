import { useMemo } from 'react';
import { useFilteredData } from './useFilteredData';
import { calcSubcategoryRanking } from '@/utils/calculations';
import type { RankingItem } from '@/types';

/**
 * 中項目別支出ランキングを計算
 * @param limit 取得件数（デフォルト: 10）
 * @returns ランキング配列
 */
export function useRanking(limit: number = 10): RankingItem[] {
  const { data } = useFilteredData();

  return useMemo(() => {
    return calcSubcategoryRanking(data, limit);
  }, [data, limit]);
}
