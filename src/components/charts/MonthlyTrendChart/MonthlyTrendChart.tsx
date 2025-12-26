import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useMonthlySummary } from '@/hooks';
import { useFilterContext } from '@/contexts';
import { ChartContainer } from '../ChartContainer';
import { CHART_COLORS } from '@/constants';
import { LineChartTooltip } from '../shared';

/**
 * 月別収支推移の折れ線グラフ
 * クリックでその月の取引をフィルター
 */
export function MonthlyTrendChart() {
  const data = useMonthlySummary();
  const { updateFilter } = useFilterContext();

  const handleChartClick = (
    chartData: { activePayload?: Array<{ payload?: { month?: string } }> } | null
  ) => {
    if (!chartData?.activePayload?.[0]?.payload?.month) {
      return;
    }
    const month = chartData.activePayload[0].payload.month;
    // "1月" -> 1 のように変換
    const monthNum = parseInt(month);
    if (!isNaN(monthNum)) {
      updateFilter('month', monthNum);
      document.getElementById('transaction-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ChartContainer title="月別収支推移" height={400}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={handleChartClick}
          style={{ cursor: 'pointer' }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}K`} />
          <Tooltip content={<LineChartTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            name="収入"
            stroke={CHART_COLORS.income}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, style: { cursor: 'pointer' } }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="支出"
            stroke={CHART_COLORS.expense}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, style: { cursor: 'pointer' } }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="収支"
            stroke={CHART_COLORS.balance}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            activeDot={{ r: 6, style: { cursor: 'pointer' } }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
