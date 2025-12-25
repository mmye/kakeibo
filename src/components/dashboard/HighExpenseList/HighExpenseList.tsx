import { useMemo } from 'react';
import { useFilteredData } from '@/hooks';
import { Card, Amount } from '@/components/ui';
import { formatDate } from '@/utils/formatters';
import { getHighExpenses } from '@/utils/calculations';

type HighExpenseListProps = {
  threshold?: number;
  limit?: number;
};

export function HighExpenseList({ threshold = 10000, limit = 10 }: HighExpenseListProps) {
  const { data } = useFilteredData();

  const highExpenses = useMemo(() => {
    return getHighExpenses(data, threshold, limit);
  }, [data, threshold, limit]);

  return (
    <Card title="高額支出">
      <div className="space-y-2">
        {highExpenses.length === 0 ? (
          <p className="text-text-secondary text-sm">
            ¥{threshold.toLocaleString()}を超える支出はありません
          </p>
        ) : (
          highExpenses.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0 gap-2"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate" title={t.description}>
                  {t.description}
                </div>
                <div className="text-xs text-text-secondary">
                  {formatDate(t.date)} • {t.category}
                </div>
              </div>
              <Amount value={t.amount} size="sm" className="flex-shrink-0" />
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
