import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useFilteredData } from '@/hooks';
import { ChartContainer } from '../ChartContainer';
import { CATEGORIES } from '@/constants';

// 収入用カラーパレット（緑系を中心に）
const INCOME_COLORS = [
  '#059669', // 収入色
  '#10B981',
  '#34D399',
  '#6EE7B7',
  '#A7F3D0',
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

  return (
    <ChartContainer title="収入源の内訳" height={400}>
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
          <Tooltip
            formatter={(value: number) => `¥${value.toLocaleString()}`}
            contentStyle={{ borderRadius: 8 }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
