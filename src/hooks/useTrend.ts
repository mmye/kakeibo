import { useMemo } from 'react';
import { useTransactionContext, useFilterContext } from '@/contexts';
import { calcTrend, calcIncome, calcExpense } from '@/utils/calculations';
import type { TrendData } from '@/types';

/**
 * 前月比を計算
 * @returns 収入・支出・収支の変化率
 */
export function useTrend(): TrendData {
  const { transactions } = useTransactionContext();
  const { filters } = useFilterContext();

  return useMemo(() => {
    // 全期間の場合は比較できないので0を返す
    if (filters.month === 'all') {
      return { income: 0, expense: 0, balance: 0 };
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

    // 収入・支出を計算
    const currentIncome = calcIncome(currentTransactions);
    const currentExpense = calcExpense(currentTransactions);
    const previousIncome = calcIncome(previousTransactions);
    const previousExpense = calcExpense(previousTransactions);

    return calcTrend(currentIncome, currentExpense, previousIncome, previousExpense);
  }, [transactions, filters.year, filters.month]);
}
