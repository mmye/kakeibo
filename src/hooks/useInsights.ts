import { useMemo } from 'react';
import { useTransactionContext, useFilterContext } from '@/contexts';
import { calcInsights } from '@/utils/calculations';
import type { Insight } from '@/types';

/**
 * 支出傾向のインサイトを生成
 * @param limit 取得するインサイトの最大数
 * @returns インサイト配列
 */
export function useInsights(limit: number = 5): Insight[] {
  const { transactions } = useTransactionContext();
  const { filters } = useFilterContext();

  return useMemo(() => {
    // 全期間の場合は当月と比較できないためインサイトなし
    if (filters.month === 'all') {
      return [];
    }

    const currentMonth = filters.month;
    const currentYear = filters.year;

    // 前月を計算
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    if (previousMonth < 1) {
      previousMonth = 12;
      previousYear = currentYear - 1;
    }

    // 当月のトランザクション
    const currentTransactions = transactions.filter((t) => {
      const tYear = t.date.getFullYear();
      const tMonth = t.date.getMonth() + 1;
      return tYear === currentYear && tMonth === currentMonth;
    });

    // 前月のトランザクション
    const previousTransactions = transactions.filter((t) => {
      const tYear = t.date.getFullYear();
      const tMonth = t.date.getMonth() + 1;
      return tYear === previousYear && tMonth === previousMonth;
    });

    return calcInsights(currentTransactions, previousTransactions, limit);
  }, [transactions, filters.year, filters.month, limit]);
}
