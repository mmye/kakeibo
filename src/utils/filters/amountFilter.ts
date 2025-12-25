import type { Transaction } from '@/types';

/**
 * 金額範囲でフィルタ
 * @param transactions トランザクション配列
 * @param min 最小金額（undefined の場合は下限なし）
 * @param max 最大金額（undefined の場合は上限なし）
 * @returns フィルター済み配列
 */
export function filterByAmountRange(
  transactions: Transaction[],
  min?: number,
  max?: number
): Transaction[] {
  return transactions.filter((t) => {
    if (min !== undefined && t.amount < min) {
      return false;
    }
    if (max !== undefined && t.amount > max) {
      return false;
    }
    return true;
  });
}

/**
 * 支出のみを抽出（負の金額）
 * @param transactions トランザクション配列
 * @returns 支出のみの配列
 */
export function filterExpenses(transactions: Transaction[]): Transaction[] {
  return transactions.filter((t) => t.amount < 0);
}

/**
 * 収入のみを抽出（正の金額）
 * @param transactions トランザクション配列
 * @returns 収入のみの配列
 */
export function filterIncomes(transactions: Transaction[]): Transaction[] {
  return transactions.filter((t) => t.amount > 0);
}
