import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useFilteredData } from '@/hooks';
import { ChartContainer } from '../ChartContainer';
import { CATEGORIES } from '@/constants';
import { IncomePieChartTooltip } from '../shared';
import { formatCurrency } from '@/utils';

// 収入用カラーパレット（Cozy Comic: Blue系グラデーション）
const INCOME_COLORS = [
  '#0284C7', // secondary-dark
  '#38BDF8', // secondary (Blanket Blue)
  '#7DD3FC', // 中間色
  '#BAE6FD', // 薄い
  '#E0F2FE', // secondary-light
  ...Object.values(CATEGORIES).map((c) => c.color),
];

/**
 * 収入源内訳の円グラフ
 */
export function IncomeChart() {
  const { data } = useFilteredData();

  const incomeData = useMemo(() => {
    const incomes = data.filter((t) => t.amount > 0);
    const bySubcategory = new Map<string, number>();

    for (const t of incomes) {
      const current = bySubcategory.get(t.subcategory) ?? 0;
      bySubcategory.set(t.subcategory, current + t.amount);
    }

    const total = incomes.reduce((sum, t) => sum + t.amount, 0);

    return Array.from(bySubcategory.entries())
      .map(([subcategory, amount]) => ({
        subcategory,
        amount,
        percentage: total > 0 ? amount / total : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [data]);

  // スクリーンリーダー用のサマリーを生成
  const ariaLabel = useMemo(() => {
    if (incomeData.length === 0) {
      return '収入源内訳グラフ。データがありません。';
    }
    const totalIncome = incomeData.reduce((sum, d) => sum + d.amount, 0);
    const top3 = incomeData.slice(0, 3);
    const summary = top3
      .map(
        (d) => `${d.subcategory}${formatCurrency(d.amount)}（${(d.percentage * 100).toFixed(0)}%）`
      )
      .join('、');
    return `収入源内訳グラフ。合計${formatCurrency(totalIncome)}、${incomeData.length}項目。上位3項目：${summary}。`;
  }, [incomeData]);

  return (
    <ChartContainer title="収入源の内訳" height={400} aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={incomeData}
            dataKey="amount"
            nameKey="subcategory"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ subcategory, percentage }) =>
              `${subcategory} (${(percentage * 100).toFixed(1)}%)`
            }
            labelLine={false}
          >
            {incomeData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<IncomePieChartTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
