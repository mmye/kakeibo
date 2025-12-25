import { TrendingUp } from 'lucide-react';
import { Card, Amount, TrendIndicator } from '@/components/ui';
import { useFilteredData, useTrend } from '@/hooks';
import { calcIncome } from '@/utils/calculations';

/**
 * 収入サマリーカード
 */
export function IncomeCard() {
  const { data } = useFilteredData();
  const trend = useTrend();
  const income = calcIncome(data);

  return (
    <Card title="月間収入" icon={TrendingUp} accentColor="income">
      <Amount value={income} size="lg" />
      <div className="mt-2">
        <TrendIndicator value={trend.income} positiveIsGood />
      </div>
    </Card>
  );
}
