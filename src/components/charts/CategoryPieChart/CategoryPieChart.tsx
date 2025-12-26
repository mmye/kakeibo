import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useCategorySummary } from '@/hooks';
import { useFilterContext } from '@/contexts';
import { ChartContainer } from '../ChartContainer';
import { PieChartTooltip } from '../shared';
import type { Props as LegendProps } from 'recharts/types/component/DefaultLegendContent';

/**
 * カスタム凡例コンポーネント（小さいフォントサイズで視認性向上）
 */
function CustomLegend({ payload }: LegendProps) {
  if (!payload) {
    return null;
  }

  return (
    <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 px-2">
      {payload.map((entry, index) => (
        <li key={`legend-${index}`} className="flex items-center">
          <span
            className="inline-block w-2 h-2 rounded-full mr-1 flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[10px] text-text-secondary whitespace-nowrap">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * カテゴリ別支出の円グラフ
 * クリックでそのカテゴリの取引をフィルター
 */
export function CategoryPieChart() {
  const data = useCategorySummary();
  const { updateFilter } = useFilterContext();

  const handleCategoryClick = (category: string) => {
    updateFilter('category', category);
    // 取引明細セクションにスクロール
    document.getElementById('transaction-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
            onClick={(_, index) => handleCategoryClick(data[index]?.category ?? '')}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} style={{ cursor: 'pointer' }} />
            ))}
          </Pie>
          <Tooltip content={<PieChartTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
