import type { Transaction } from '@/schemas';
import { loadTSV } from './dataLoader';
import { parseTSV } from './dataParser';
import { transformTransactions } from './dataTransformer';

// Re-export individual services
export { loadTSV } from './dataLoader';
export { parseTSV } from './dataParser';
export { transformTransactions } from './dataTransformer';

// Re-export errors from schemas
export { DataLoadError, DataParseError } from '@/schemas';

/**
 * メインのエントリーポイント
 * TSVファイルを読み込み、パースし、Transaction配列に変換する
 */
export async function loadTransactions(): Promise<Transaction[]> {
  const tsv = await loadTSV();
  const raw = parseTSV(tsv);
  return transformTransactions(raw);
}
