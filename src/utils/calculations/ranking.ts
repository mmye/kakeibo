import type { Transaction, RankingItem } from '@/types';

/**
 * 中項目別の支出ランキングを計算
 */
export function calcSubcategoryRanking(
  transactions: Transaction[],
  limit: number = 10
): RankingItem[] {
  const expenses = transactions.filter((t) => t.amount < 0);
  const totalExpense = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0));

  const grouped = expenses.reduce(
    (acc, t) => {
      const key = t.subcategory || t.category;
      if (!acc[key]) {
        acc[key] = { amount: 0, category: t.category };
      }
      acc[key].amount += Math.abs(t.amount);
      return acc;
    },
    {} as Record<string, { amount: number; category: string }>
  );

  return Object.entries(grouped)
    .map(([subcategory, { amount, category }]) => ({
      rank: 0,
      subcategory,
      category,
      amount,
      percentage: totalExpense > 0 ? amount / totalExpense : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

/**
 * 高額支出を抽出
 */
export function getHighExpenses(
  transactions: Transaction[],
  threshold: number = 10000,
  limit: number = 10
): Transaction[] {
  return transactions
    .filter((t) => t.amount < -threshold)
    .sort((a, b) => a.amount - b.amount)
    .slice(0, limit);
}

/**
 * カテゴリ別のトップN支出を取得
 */
export function getTopExpensesByCategory(
  transactions: Transaction[],
  category: string,
  limit: number = 5
): Transaction[] {
  return transactions
    .filter((t) => t.category === category && t.amount < 0)
    .sort((a, b) => a.amount - b.amount)
    .slice(0, limit);
}
