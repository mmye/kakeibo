import type { Transaction } from '@/types';

/**
 * カテゴリでフィルタ
 * @param transactions トランザクション配列
 * @param category カテゴリ名
 * @returns フィルター済み配列
 */
export function filterByCategory(transactions: Transaction[], category: string): Transaction[] {
  return transactions.filter((t) => t.category === category);
}

/**
 * 中項目でフィルタ
 * @param transactions トランザクション配列
 * @param subcategory 中項目名
 * @returns フィルター済み配列
 */
export function filterBySubcategory(
  transactions: Transaction[],
  subcategory: string
): Transaction[] {
  return transactions.filter((t) => t.subcategory === subcategory);
}

/**
 * 金融機関でフィルタ
 * @param transactions トランザクション配列
 * @param institution 金融機関名
 * @returns フィルター済み配列
 */
export function filterByInstitution(
  transactions: Transaction[],
  institution: string
): Transaction[] {
  return transactions.filter((t) => t.institution === institution);
}

/**
 * 検索クエリでフィルタ（説明文の部分一致、大文字小文字区別なし）
 * @param transactions トランザクション配列
 * @param query 検索文字列
 * @returns フィルター済み配列
 */
export function filterBySearchQuery(transactions: Transaction[], query: string): Transaction[] {
  if (!query) {
    return transactions;
  }
  const lowerQuery = query.toLowerCase();
  return transactions.filter((t) => t.description.toLowerCase().includes(lowerQuery));
}
