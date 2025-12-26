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
import { useFilterContext } from '@/contexts';
import { ChartContainer } from '../ChartContainer';
import { BarChartTooltip } from '../shared';

/**
 * カテゴリ別支出の横棒グラフ
 * クリックでそのカテゴリの取引をフィルター
 */
export function CategoryBarChart() {
  const data = useCategorySummary();
  const { updateFilter } = useFilterContext();

  const handleCategoryClick = (category: string) => {
    updateFilter('category', category);
    document.getElementById('transaction-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
          <Bar
            dataKey="amount"
            name="支出"
            onClick={(data) => handleCategoryClick(data.category)}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} style={{ cursor: 'pointer' }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
