/**
 * 日付を「YYYY/MM/DD」形式でフォーマット
 * @example formatDate(new Date('2025-01-15')) → "2025/01/15"
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * 日付を「YYYY年MM月」形式でフォーマット
 * @example formatYearMonth(new Date('2025-01-15')) → "2025年01月"
 */
export function formatYearMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}年${month}月`;
}

/**
 * 日付を「M月」形式でフォーマット（短縮形）
 * @example formatMonthShort(new Date('2025-01-15')) → "1月"
 */
export function formatMonthShort(date: Date): string {
  return `${date.getMonth() + 1}月`;
}

/**
 * 月番号を「M月」形式でフォーマット
 * @example formatMonthLabel(1) → "1月"
 * @example formatMonthLabel(12) → "12月"
 */
export function formatMonthLabel(month: number): string {
  return `${month}月`;
}

/**
 * YYYY-MM-DD形式の文字列をDateオブジェクトに変換
 * @example parseDate("2025-01-15") → Date
 */
export function parseDate(dateString: string): Date {
  const parts = dateString.split('-').map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  return new Date(year, month - 1, day);
}
