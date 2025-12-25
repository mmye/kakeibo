import { useMemo } from 'react';
import { useFilteredData } from './useFilteredData';
import type { Transaction } from '@/types';

/**
 * データをチャート用に変換する汎用フック
 * @param transformer 変換関数
 * @returns 変換済みチャートデータ
 */
export function useChartData<T>(transformer: (data: Transaction[]) => T): T {
  const { data } = useFilteredData();

  return useMemo(() => {
    return transformer(data);
  }, [data, transformer]);
}
