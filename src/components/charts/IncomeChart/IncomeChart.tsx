import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useFilteredData } from '@/hooks';
import { ChartContainer } from '../ChartContainer';
import { formatCurrency } from '@/utils';

// 収入用カラーパレット（Blue系グラデーション）
const INCOME_COLORS: Record<string, string> = {
  給与: '#0284C7', // secondary-dark
  賞与: '#38BDF8', // Blanket Blue
  ポイント: '#7DD3FC', // 中間色
  児童手当: '#06B6D4', // Cyan
  還付金: '#0EA5E9', // Sky
  配当: '#22D3EE', // Light Cyan
  その他: '#BAE6FD', // 薄いBlue
};

function getIncomeColor(subcategory: string): string {
  return INCOME_COLORS[subcategory] ?? '#7DD3FC';
}

type IncomeMonthlyDataPoint = {
  month: string;
  total: number;
  [subcategory: string]: number | string;
};

/**
 * Format amount for display
 */
function formatAmount(value: number): string {
  return `¥${value.toLocaleString()}`;
}

/**
 * Custom tooltip for income stacked area chart
 */
function IncomeAreaTooltip({
  active,
  payload,
  label,
  subcategories,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
  subcategories: string[];
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const total = payload
    .filter((entry) => subcategories.includes(entry.dataKey))
    .reduce((sum, entry) => sum + (entry.value || 0), 0);

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
          {payload
            .filter((entry) => subcategories.includes(entry.dataKey) && entry.value > 0)
            .sort((a, b) => b.value - a.value)
            .map((entry, index) => (
              <tr key={index}>
                <td className="py-0.5 text-sm" style={{ color: getIncomeColor(entry.dataKey) }}>
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: getIncomeColor(entry.dataKey) }}
                  />
                  {entry.dataKey}
                </td>
                <td
                  className="py-0.5 text-sm text-right font-medium tabular-nums"
                  style={{ color: '#374151' }}
                >
                  {formatAmount(entry.value)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
        <span className="text-xs text-gray-500">Total</span>
        <span className="font-bold text-sm" style={{ color: '#0284C7' }}>
          {formatAmount(total)}
        </span>
      </div>
    </div>
  );
}

/**
 * 収入源内訳の積み上げエリアチャート
 */
export function IncomeChart() {
  const { data: transactions } = useFilteredData();

  const { data, subcategories, totalIncome } = useMemo(() => {
    // 収入のみを抽出
    const incomes = transactions.filter((t) => t.amount > 0);

    // サブカテゴリと月を収集
    const subcategorySet = new Set<string>();
    const monthSet = new Set<string>();
    const valueMap = new Map<string, number>();
    let totalIncome = 0;

    for (const t of incomes) {
      const month = `${t.date.getMonth() + 1}月`;
      monthSet.add(month);
      subcategorySet.add(t.subcategory);

      const key = `${month}-${t.subcategory}`;
      const current = valueMap.get(key) ?? 0;
      valueMap.set(key, current + t.amount);
      totalIncome += t.amount;
    }

    // 月をソート
    const months = Array.from(monthSet).sort((a, b) => parseInt(a) - parseInt(b));

    // サブカテゴリを収入額順にソート
    const subcategoryTotals = Array.from(subcategorySet).map((subcategory) => {
      let total = 0;
      for (const month of months) {
        total += valueMap.get(`${month}-${subcategory}`) ?? 0;
      }
      return { subcategory, total };
    });
    subcategoryTotals.sort((a, b) => b.total - a.total);
    const subcategories = subcategoryTotals.map((s) => s.subcategory);

    // チャートデータを生成
    const data: IncomeMonthlyDataPoint[] = months.map((month) => {
      const point: IncomeMonthlyDataPoint = { month, total: 0 };
      for (const subcategory of subcategories) {
        const value = valueMap.get(`${month}-${subcategory}`) ?? 0;
        point[subcategory] = value;
        point.total += value;
      }
      return point;
    });

    return { data, subcategories, totalIncome };
  }, [transactions]);

  // スクリーンリーダー用のサマリーを生成
  const ariaLabel = useMemo(() => {
    if (data.length === 0) {
      return '収入源推移グラフ。データがありません。';
    }
    return `収入源推移グラフ。${data.length}ヶ月分のデータ。${subcategories.length}項目。総収入${formatCurrency(totalIncome)}。`;
  }, [data.length, subcategories.length, totalIncome]);

  if (data.length === 0) {
    return (
      <ChartContainer title="収入源の推移" height={400} aria-label={ariaLabel}>
        <div className="flex items-center justify-center h-full text-text-secondary">
          表示するデータがありません
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="収入源の推移" height={400} aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {subcategories.map((subcategory) => {
              const color = getIncomeColor(subcategory);
              return (
                <linearGradient
                  key={subcategory}
                  id={`incomeGradient-${subcategory.replace(/[・]/g, '-')}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.85} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#374151' }}
            tickLine={{ stroke: '#E5E7EB' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#374151' }}
            tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}K`}
            tickLine={{ stroke: '#E5E7EB' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<IncomeAreaTooltip subcategories={subcategories} />} />
          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ color: '#374151', fontSize: '12px' }}>{value}</span>
            )}
          />
          {subcategories.map((subcategory) => (
            <Area
              key={subcategory}
              type="monotone"
              dataKey={subcategory}
              stackId="1"
              stroke={getIncomeColor(subcategory)}
              strokeWidth={1}
              fill={`url(#incomeGradient-${subcategory.replace(/[・]/g, '-')})`}
              fillOpacity={1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
