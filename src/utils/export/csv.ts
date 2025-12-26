import type { Transaction } from '@/types';
import { formatDate } from '@/utils/formatters';

/**
 * 取引データをCSV形式に変換
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  const headers = ['日付', '内容', '金額', '大項目', '中項目', '金融機関', 'メモ'];
  const headerRow = headers.join(',');

  const dataRows = transactions.map((t) => {
    const row = [
      formatDate(t.date),
      escapeCSVField(t.description),
      t.amount.toString(),
      escapeCSVField(t.category),
      escapeCSVField(t.subcategory),
      escapeCSVField(t.institution),
      escapeCSVField(t.memo),
    ];
    return row.join(',');
  });

  // BOMを追加してExcelでの文字化けを防止
  const BOM = '\uFEFF';
  return BOM + [headerRow, ...dataRows].join('\n');
}

/**
 * CSVフィールドをエスケープ
 * カンマ、ダブルクォート、改行を含む場合はダブルクォートで囲む
 */
function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * CSVデータをダウンロード
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 取引データをCSVとしてダウンロード
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  year: number,
  month: number | 'all'
): void {
  const csv = transactionsToCSV(transactions);
  const monthStr = month === 'all' ? '全期間' : `${month}月`;
  const filename = `家計簿_${year}年${monthStr}.csv`;
  downloadCSV(csv, filename);
}
