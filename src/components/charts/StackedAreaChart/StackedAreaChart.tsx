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
import { useCategoryMonthlyData } from '@/hooks';
import { ChartContainer } from '../ChartContainer';
import { formatCurrency } from '@/utils';

/**
 * Format amount for display
 */
function formatAmount(value: number): string {
  return `¥${value.toLocaleString()}`;
}

/**
 * Custom tooltip for stacked area chart
 */
function StackedAreaTooltip({
  active,
  payload,
  label,
  categories,
  getCategoryColor,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
  categories: string[];
  getCategoryColor: (category: string) => string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Calculate total
  const total = payload
    .filter((entry) => categories.includes(entry.dataKey))
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
            .filter((entry) => categories.includes(entry.dataKey) && entry.value > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5) // Top 5 categories
            .map((entry, index) => (
              <tr key={index}>
                <td className="py-0.5 text-sm" style={{ color: getCategoryColor(entry.dataKey) }}>
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: getCategoryColor(entry.dataKey) }}
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
        <span className="font-bold text-sm" style={{ color: '#F43F5E' }}>
          {formatAmount(total)}
        </span>
      </div>
    </div>
  );
}

/**
 * Stacked Area Chart - Category breakdown over time
 * Shows expense trends by category with stacked areas
 */
export function StackedAreaChart() {
  const { data, categories, totalExpense, getCategoryColor } = useCategoryMonthlyData();

  // Generate aria label for accessibility
  const ariaLabel = useMemo(() => {
    if (data.length === 0) {
      return 'カテゴリ別支出推移グラフ。データがありません。';
    }
    return `カテゴリ別支出推移グラフ。${data.length}ヶ月分のデータ。${categories.length}カテゴリ。総支出${formatCurrency(totalExpense)}。`;
  }, [data.length, categories.length, totalExpense]);

  if (data.length === 0) {
    return (
      <ChartContainer title="カテゴリ別支出推移" height={400} aria-label={ariaLabel}>
        <div className="flex items-center justify-center h-full text-text-secondary">
          表示するデータがありません
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="カテゴリ別支出推移" height={400} aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {categories.map((category) => {
              const color = getCategoryColor(category);
              return (
                <linearGradient
                  key={category}
                  id={`stackedGradient-${category.replace(/[・]/g, '-')}`}
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
          <Tooltip
            content={
              <StackedAreaTooltip categories={categories} getCategoryColor={getCategoryColor} />
            }
          />
          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ color: '#374151', fontSize: '12px' }}>{value}</span>
            )}
          />
          {categories.map((category) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stackId="1"
              stroke={getCategoryColor(category)}
              strokeWidth={1}
              fill={`url(#stackedGradient-${category.replace(/[・]/g, '-')})`}
              fillOpacity={1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
