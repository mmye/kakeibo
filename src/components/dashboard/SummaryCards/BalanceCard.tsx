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
    <Card title="収支バランス" accentColor="primary">
      <Amount value={balance} size="lg" />
      <div className="mt-2">
        <TrendIndicator value={trend.balance} positiveIsGood />
      </div>
    </Card>
  );
}
