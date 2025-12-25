import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useCategorySummary } from '@/hooks';
import { ChartContainer } from '../ChartContainer';

/**
 * カテゴリ別支出の円グラフ
 */
export function CategoryPieChart() {
  const data = useCategorySummary();

  return (
    <ChartContainer title="カテゴリ別支出" height={400}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ category, percentage }) => `${category} ${(percentage * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
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
