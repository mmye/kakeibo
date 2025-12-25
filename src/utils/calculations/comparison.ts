import type { TrendData } from '@/types';

/**
 * 前月比を計算
 * @returns 変化率 (0.05 = +5%)、前月データがない場合はnull
 */
export function calcMonthOverMonth(
  current: number,
  previous: number,
  hasPreviousData: boolean = true
): number | null {
  if (!hasPreviousData) {
    return null;
  }
  if (previous === 0) {
    // 前月が0で今月が0以外の場合は無限大の変化なのでnull
    if (current !== 0) {
      return null;
    }
    return 0;
  }
  return (current - previous) / Math.abs(previous);
}

/**
 * 成長率を計算（最初と最後の値の比較）
 * @returns 変化率 (0.05 = +5%)
 */
export function calcGrowthRate(values: number[]): number {
  if (values.length < 2) {
    return 0;
  }
  const first = values[0]!;
  const last = values[values.length - 1]!;
  if (first === 0) {
    return 0;
  }
  return (last - first) / Math.abs(first);
}

/**
 * トレンドデータを計算（収入・支出・収支の変化率）
 * @param hasPreviousData 前月データが存在するかどうか
 */
export function calcTrend(
  currentIncome: number,
  currentExpense: number,
  previousIncome: number,
  previousExpense: number,
  hasPreviousData: boolean = true
): TrendData {
  const currentBalance = currentIncome - currentExpense;
  const previousBalance = previousIncome - previousExpense;

  return {
    income: calcMonthOverMonth(currentIncome, previousIncome, hasPreviousData),
    expense: calcMonthOverMonth(currentExpense, previousExpense, hasPreviousData),
    balance: calcMonthOverMonth(currentBalance, previousBalance, hasPreviousData),
  };
}

/**
 * 平均を計算
 */
export function calcAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
