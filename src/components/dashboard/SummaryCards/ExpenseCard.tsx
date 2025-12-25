import { TrendingDown } from 'lucide-react';
import { Card, Amount, TrendIndicator } from '@/components/ui';
import { useFilteredData, useTrend } from '@/hooks';
import { calcExpense } from '@/utils/calculations';

/**
 * 支出サマリーカード
 */
export function ExpenseCard() {
  const { data } = useFilteredData();
  const trend = useTrend();
  const expense = calcExpense(data);

  return (
    <Card title="月間支出" icon={TrendingDown} accentColor="expense">
      <Amount value={-expense} size="lg" />
      <div className="mt-2">
        <TrendIndicator value={trend.expense} positiveIsGood={false} />
      </div>
    </Card>
  );
}
