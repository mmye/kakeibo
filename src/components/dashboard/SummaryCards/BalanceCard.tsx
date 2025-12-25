import { Scale } from 'lucide-react';
import { Card, Amount, TrendIndicator } from '@/components/ui';
import { useFilteredData, useTrend } from '@/hooks';
import { calcIncome, calcExpense } from '@/utils/calculations';

/**
 * 収支バランスサマリーカード
 */
export function BalanceCard() {
  const { data } = useFilteredData();
  const trend = useTrend();
  const income = calcIncome(data);
  const expense = calcExpense(data);
  const balance = income - expense;

  return (
    <Card title="収支バランス" icon={Scale} accentColor="primary" size="large" highlighted>
      <Amount value={balance} size="xl" />
      <div className="mt-3">
        <TrendIndicator value={trend.balance} positiveIsGood />
      </div>
    </Card>
  );
}
