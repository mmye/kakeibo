import type { Transaction, RawTransaction } from '@/schemas';

/**
 * 生データ配列をTransaction型配列に変換
 * 変換に失敗したレコードはスキップされる
 */
export function transformTransactions(raw: RawTransaction[]): Transaction[] {
  return raw.map(transformTransaction).filter((t): t is Transaction => t !== null);
}

/**
 * 単一の生データをTransaction型に変換
 * @returns 変換成功時はTransaction、失敗時はnull
 */
function transformTransaction(raw: RawTransaction): Transaction | null {
  try {
    return {
      id: raw['ID'] || generateId(),
      date: parseDate(raw['日付']),
      description: raw['内容'] || '',
      amount: parseAmount(raw['金額（円）']),
      institution: raw['保有金融機関'] || '',
      category: raw['大項目'] || 'その他',
      subcategory: raw['中項目'] || '',
      memo: raw['メモ'] || '',
      isTransfer: raw['振替'] === '1',
      isCalculated: raw['計算対象'] === '1',
    };
  } catch {
    return null;
  }
}

/**
 * 日付文字列をDateオブジェクトに変換
 * @param dateStr "YYYY/MM/DD" 形式の文字列
 */
function parseDate(dateStr: string): Date {
  const parts = dateStr.split('/').map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return new Date(year, month - 1, day);
}

/**
 * 金額文字列を数値に変換
 */
function parseAmount(amountStr: string): number {
  const amount = parseInt(amountStr, 10);
  if (isNaN(amount)) {
    throw new Error(`Invalid amount: ${amountStr}`);
  }
  return amount;
}

/**
 * IDがない場合のランダムID生成
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
