import { Amount, CategoryIcon } from '@/components/ui';
import { formatDate } from '@/utils/formatters';
import type { Transaction } from '@/types';

type TransactionCardProps = {
  transaction: Transaction;
};

/**
 * モバイル向け取引カード
 * テーブル行をカード形式で表示
 */
export function TransactionCard({ transaction }: TransactionCardProps) {
  const t = transaction;

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      {/* 1行目: 日付、カテゴリアイコン、カテゴリ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">{formatDate(t.date)}</span>
          <span className="text-text-tertiary">•</span>
          <div className="flex items-center gap-1.5">
            <CategoryIcon category={t.category} size="sm" />
            <span className="text-sm text-text-secondary">{t.category}</span>
          </div>
        </div>
        <Amount value={t.amount} size="md" />
      </div>

      {/* 2行目: 内容 */}
      <p className="mt-2 text-text-primary font-medium line-clamp-2" title={t.description}>
        {t.description}
      </p>

      {/* 3行目: 金融機関、中項目 */}
      <div className="mt-2 flex items-center gap-2 text-sm text-text-tertiary">
        <span>{t.institution}</span>
        <span>•</span>
        <span>{t.subcategory}</span>
      </div>
    </div>
  );
}
