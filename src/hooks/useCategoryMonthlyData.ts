import { useMemo } from 'react';
import { useFilteredData } from './useFilteredData';
import { getDailyCategoryColor } from '@/constants';

export type CategoryMonthlyDataPoint = {
  month: string;
  total: number;
  [category: string]: number | string;
};

export type UseCategoryMonthlyDataReturn = {
  data: CategoryMonthlyDataPoint[];
  categories: string[];
  totalExpense: number;
  getCategoryColor: (category: string) => string;
};

/**
 * 月別×カテゴリ別の支出データを生成
 * 積み上げエリアチャート用
 */
export function useCategoryMonthlyData(): UseCategoryMonthlyDataReturn {
  const { data: transactions } = useFilteredData();

  return useMemo(() => {
    // 支出のみを抽出
    const expenses = transactions.filter((t) => t.amount < 0);

    // カテゴリと月を収集
    const categorySet = new Set<string>();
    const monthSet = new Set<string>();
    const valueMap = new Map<string, number>();
    let totalExpense = 0;

    for (const t of expenses) {
      const month = `${t.date.getMonth() + 1}月`;
      monthSet.add(month);
      categorySet.add(t.category);

      const key = `${month}-${t.category}`;
      const current = valueMap.get(key) ?? 0;
      const amount = Math.abs(t.amount);
      valueMap.set(key, current + amount);
      totalExpense += amount;
    }

    // 月をソート
    const months = Array.from(monthSet).sort((a, b) => parseInt(a) - parseInt(b));

    // カテゴリを支出額順にソート
    const categoryTotals = Array.from(categorySet).map((category) => {
      let total = 0;
      for (const month of months) {
        total += valueMap.get(`${month}-${category}`) ?? 0;
      }
      return { category, total };
    });
    categoryTotals.sort((a, b) => b.total - a.total);
    const categories = categoryTotals.map((c) => c.category);

    // チャートデータを生成
    const data: CategoryMonthlyDataPoint[] = months.map((month) => {
      const point: CategoryMonthlyDataPoint = { month, total: 0 };
      for (const category of categories) {
        const value = valueMap.get(`${month}-${category}`) ?? 0;
        point[category] = value;
        point.total += value;
      }
      return point;
    });

    return {
      data,
      categories,
      totalExpense,
      getCategoryColor: getDailyCategoryColor,
    };
  }, [transactions]);
}
