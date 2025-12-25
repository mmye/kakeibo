import { DataParseError } from '@/schemas';
import type { RawTransaction } from '@/schemas';

/**
 * TSV文字列をパースして生データオブジェクトの配列を返す
 * @throws {DataParseError} パースに失敗した場合
 */
export function parseTSV(tsv: string): RawTransaction[] {
  const lines = tsv.trim().split('\n');
  if (lines.length < 2) {
    throw new DataParseError('TSV must have header and at least one data row');
  }

  const headers = lines[0]!.split('\t');

  return lines.slice(1).map((line, index) => {
    const values = line.split('\t');
    if (values.length !== headers.length) {
      throw new DataParseError(`Column count mismatch at line ${index + 2}`, index + 2);
    }
    return Object.fromEntries(headers.map((h, i) => [h, values[i]])) as RawTransaction;
  });
}
