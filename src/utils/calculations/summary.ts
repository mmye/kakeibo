import type { Transaction, MonthlySummary, CategorySummary } from '@/types';

// デフォルトの色（constants/categoriesが実装されるまでの仮）
const DEFAULT_COLOR = '#6B7280';

/**
 * 合計金額を計算
 * @param transactions トランザクション配列
 * @returns 合計金額
 */
export function calcTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

/**
 * 収入合計を計算（正の金額のみ）
 * @param transactions トランザクション配列
 * @returns 収入合計
 */
export function calcIncome(transactions: Transaction[]): number {
  return transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
}

/**
 * 支出合計を計算（絶対値で返す）
 * @param transactions トランザクション配列
 * @returns 支出合計（正の値）
 */
export function calcExpense(transactions: Transaction[]): number {
  return Math.abs(transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
}

/**
 * 月別サマリーを計算
 * @param transactions トランザクション配列
 * @returns 月別サマリー配列（1月〜12月順）
 */
export function calcMonthlySummary(transactions: Transaction[]): MonthlySummary[] {
  if (transactions.length === 0) {
    return [];
  }

  const grouped = groupByMonth(transactions);

  return Object.entries(grouped)
    .map(([month, txs]) => ({
      month,
      income: calcIncome(txs),
      expense: calcExpense(txs),
      balance: calcTotal(txs),
    }))
    .sort((a, b) => {
      // "1月", "2月" の数字部分で比較
      const numA = parseInt(a.month.replace('月', ''), 10);
      const numB = parseInt(b.month.replace('月', ''), 10);
      return numA - numB;
    });
}

/**
 * カテゴリ別サマリーを計算（支出のみ）
 * @param transactions トランザクション配列
 * @returns カテゴリ別サマリー配列（金額降順）
 */
export function calcCategorySummary(transactions: Transaction[]): CategorySummary[] {
  // 支出のみを対象
  const expenses = transactions.filter((t) => t.amount < 0);

  if (expenses.length === 0) {
    return [];
  }

  const totalExpense = calcExpense(expenses);

  const grouped = expenses.reduce(
    (acc, t) => {
      const category = t.category;
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? amount / totalExpense : 0,
      color: DEFAULT_COLOR, // TODO: getCategoryColor(category) を使用
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * 月ごとにトランザクションをグループ化
 */
function groupByMonth(transactions: Transaction[]): Record<string, Transaction[]> {
  return transactions.reduce(
    (acc, t) => {
      const month = `${t.date.getMonth() + 1}月`;
      (acc[month] ??= []).push(t);
      return acc;
    },
    {} as Record<string, Transaction[]>
  );
}
