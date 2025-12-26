import { AlertTriangle } from 'lucide-react';
import { Amount, CategoryIcon } from '@/components/ui';
import { formatDate } from '@/utils/formatters';
import { getAnomalyLabel } from '@/utils/calculations';
import { cn } from '@/utils';
import type { Transaction, Anomaly } from '@/types';

type TransactionCardProps = {
  transaction: Transaction;
  anomalies?: Anomaly[] | undefined;
};

/**
 * モバイル向け取引カード
 * テーブル行をカード形式で表示
 */
export function TransactionCard({ transaction, anomalies }: TransactionCardProps) {
  const t = transaction;
  const anomalyList = anomalies ?? [];
  const hasAnomaly = anomalyList.length > 0;

  return (
    <div
      className={cn(
        'bg-surface border rounded-lg p-4',
        hasAnomaly ? 'border-warning bg-warning-light/30' : 'border-border'
      )}
    >
      {/* 異常バッジ */}
      {hasAnomaly && (
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-warning/30">
          <AlertTriangle size={16} className="text-warning" />
          <div className="flex flex-wrap gap-1">
            {anomalyList.map((anomaly, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-warning/20 text-warning"
                title={anomaly.reason}
              >
                {getAnomalyLabel(anomaly.type)}
              </span>
            ))}
          </div>
        </div>
      )}

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

      {/* 異常理由 */}
      {hasAnomaly && (
        <div className="mt-2 pt-2 border-t border-warning/30">
          <p className="text-xs text-warning">{anomalyList.map((a) => a.reason).join(' / ')}</p>
        </div>
      )}
    </div>
  );
}
