import type { Transaction } from '@/types';

/**
 * 特定月のデータを抽出
 * @param transactions トランザクション配列
 * @param year 年
 * @param month 月（1-12）
 * @returns フィルター済み配列
 */
export function filterByMonth(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  return transactions.filter((t) => {
    const d = t.date;
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

/**
 * 特定年のデータを抽出
 * @param transactions トランザクション配列
 * @param year 年
 * @returns フィルター済み配列
 */
export function filterByYear(transactions: Transaction[], year: number): Transaction[] {
  return transactions.filter((t) => t.date.getFullYear() === year);
}

/**
 * 期間でフィルタ
 * @param transactions トランザクション配列
 * @param start 開始日
 * @param end 終了日
 * @returns フィルター済み配列
 */
export function filterByDateRange(
  transactions: Transaction[],
  start: Date,
  end: Date
): Transaction[] {
  return transactions.filter((t) => t.date >= start && t.date <= end);
}
