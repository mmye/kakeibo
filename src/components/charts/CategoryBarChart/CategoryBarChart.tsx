import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { useCategorySummary } from '@/hooks';
import { ChartContainer } from '../ChartContainer';
import { BarChartTooltip } from '../shared';

/**
 * カテゴリ別支出の横棒グラフ
 */
export function CategoryBarChart() {
  const data = useCategorySummary();

  return (
    <ChartContainer title="カテゴリ別支出（棒グラフ）" height={400}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}K`}
          />
          <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={80} />
          <Tooltip content={<BarChartTooltip />} />
          <Bar dataKey="amount" name="支出">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
