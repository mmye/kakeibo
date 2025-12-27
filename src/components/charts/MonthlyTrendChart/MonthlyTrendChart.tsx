import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useMonthlySummary } from '@/hooks';
import { useFilterContext } from '@/contexts';
import { ChartContainer } from '../ChartContainer';
import { CHART_COLORS } from '@/constants';
import { formatCurrency } from '@/utils';

/**
 * 月別収支推移の複合グラフ（収入上方向、支出下方向のスタックバー + 収支折れ線）
 * クリックでその月の取引をフィルター
 */
export function MonthlyTrendChart() {
  const rawData = useMonthlySummary();
  const { updateFilter } = useFilterContext();

  // 支出を負の値に変換してスタックバー用のデータを作成
  const data = useMemo(() => {
    return rawData.map((d) => ({
      ...d,
      negativeExpense: -d.expense, // 下方向に伸びるよう負の値に
    }));
  }, [rawData]);

  // スクリーンリーダー用のサマリーを生成
  const ariaLabel = useMemo(() => {
    if (rawData.length === 0) {
      return '月別収支推移グラフ。データがありません。';
    }
    const totalIncome = rawData.reduce((sum, d) => sum + d.income, 0);
    const totalExpense = rawData.reduce((sum, d) => sum + d.expense, 0);
    const totalBalance = totalIncome - totalExpense;
    return `月別収支推移グラフ。${rawData.length}ヶ月分のデータ。年間収入${formatCurrency(totalIncome)}、年間支出${formatCurrency(totalExpense)}、年間収支${formatCurrency(totalBalance)}。グラフをクリックすると、その月の明細が表示されます。`;
  }, [rawData]);

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
    <ChartContainer title="月別収支推移" height={400} aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={handleChartClick}
          style={{ cursor: 'pointer' }}
          stackOffset="sign"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#374151' }} />
          <YAxis
            tick={{ fontSize: 12, fill: '#374151' }}
            tickFormatter={(v) => `¥${Math.abs(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<DivergingBarTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
          />
          {/* ゼロライン */}
          <ReferenceLine y={0} stroke="#9CA3AF" strokeWidth={1.5} />
          {/* 収入バー（上方向、上端に角丸） */}
          <Bar
            dataKey="income"
            name="収入"
            fill={CHART_COLORS.income}
            stackId="diverging"
            radius={[6, 6, 0, 0]}
            style={{ cursor: 'pointer' }}
          />
          {/* 支出バー（下方向、下端に角丸） - 負の値なのでradiusは逆に指定 */}
          <Bar
            dataKey="negativeExpense"
            name="支出"
            fill={CHART_COLORS.expense}
            stackId="diverging"
            radius={[6, 6, 0, 0]}
            style={{ cursor: 'pointer' }}
          />
          {/* 収支折れ線 */}
          <Line
            type="monotone"
            dataKey="balance"
            name="収支"
            stroke={CHART_COLORS.balance}
            strokeWidth={3}
            dot={{ r: 5, fill: CHART_COLORS.balance, stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 7, style: { cursor: 'pointer' } }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

/**
 * 発散バーチャート用のカスタムツールチップ
 */
function DivergingBarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-xl shadow-lg p-4 min-w-[180px] border-0"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}
    >
      <p className="text-sm font-bold mb-2" style={{ color: '#374151' }}>
        {label}
      </p>
      <table className="w-full">
        <tbody>
          {payload.map((entry, index) => {
            // negativeExpenseは絶対値で表示
            const displayValue =
              entry.dataKey === 'negativeExpense' ? Math.abs(entry.value) : entry.value;
            const displayName = entry.dataKey === 'negativeExpense' ? '支出' : entry.name;

            return (
              <tr key={index}>
                <td className="py-0.5 text-sm" style={{ color: entry.color }}>
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  {displayName}
                </td>
                <td
                  className="py-0.5 text-sm text-right font-medium tabular-nums"
                  style={{ color: '#374151' }}
                >
                  {formatCurrency(displayValue)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
