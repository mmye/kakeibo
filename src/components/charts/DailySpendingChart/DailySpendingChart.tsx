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
  Brush,
} from 'recharts';
import { useDailySpending } from '@/hooks';
import { ChartContainer } from '../ChartContainer';
import { getDailyCategoryColor } from '@/constants';
import { formatCurrency } from '@/utils';
import type { DailySpendingData } from '@/types';

type DailySpendingChartProps = {
  /** Enable X-axis zoom via Brush (default: true) */
  enableZoom?: boolean;
  /** Chart height in px (default: 500) */
  height?: number;
};

/**
 * Format amount for tooltip
 */
function formatAmount(value: number): string {
  return `¥${value.toLocaleString()}`;
}

/**
 * Custom tooltip for daily spending chart
 */
function DailySpendingTooltip({
  active,
  payload,
  label,
  categories,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
  categories: string[];
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Find the data point to get dayOfWeek
  const dataPoint = payload[0] as unknown as { payload?: DailySpendingData };
  const dayOfWeek = dataPoint?.payload?.dayOfWeek || '';
  const total = dataPoint?.payload?.total || 0;

  // Format date as YYYY.MM.DD
  const formattedDate = label?.replace(/-/g, '.') || '';

  return (
    <div className="bg-surface/98 border border-border rounded-xl shadow-lg p-4 min-w-[180px]">
      <p className="text-sm font-semibold text-text-primary mb-3 pb-2 border-b border-dashed border-border">
        {formattedDate} ({dayOfWeek})
      </p>
      <div className="space-y-1.5">
        {payload
          .filter((entry) => categories.includes(entry.dataKey) && entry.value > 0)
          .map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-text-secondary">{entry.dataKey}</span>
              </div>
              <span className="text-sm font-medium tabular-nums text-text-primary">
                {formatAmount(entry.value)}
              </span>
            </div>
          ))}
      </div>
      <div className="mt-3 pt-2 border-t border-dashed border-border flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary">合計</span>
        <span className="text-sm font-bold tabular-nums text-text-primary">
          {formatAmount(total)}
        </span>
      </div>
    </div>
  );
}

/**
 * Daily Spending Wave Chart
 * Stacked area chart showing daily expenses by category
 */
export function DailySpendingChart({ enableZoom = true, height = 500 }: DailySpendingChartProps) {
  const { data, categories, totalSpending, averageDaily, peakDay } = useDailySpending();

  // Generate aria label for accessibility
  const ariaLabel = useMemo(() => {
    if (data.length === 0) {
      return '日別支出ウェーブチャート。データがありません。';
    }
    return `日別支出ウェーブチャート。${data.length}日間のデータ。合計${formatCurrency(totalSpending)}、日平均${formatCurrency(averageDaily)}。${categories.length}カテゴリを表示。`;
  }, [data.length, totalSpending, averageDaily, categories.length]);

  // Format X-axis date label
  const formatXAxis = (date: string) => {
    const parts = date.split('-');
    if (parts.length === 3 && parts[1] && parts[2]) {
      return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    }
    return date;
  };

  if (data.length === 0) {
    return (
      <ChartContainer title="日別支出ウェーブ" height={height} aria-label={ariaLabel}>
        <div className="flex items-center justify-center h-full text-text-secondary">
          表示するデータがありません
        </div>
      </ChartContainer>
    );
  }

  const description = peakDay
    ? `最大支出日: ${peakDay.date.replace(/-/g, '/')} (${formatAmount(peakDay.amount)})`
    : undefined;

  return (
    <ChartContainer
      title="日別支出ウェーブ"
      {...(description ? { description } : {})}
      height={height}
      aria-label={ariaLabel}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: enableZoom ? 40 : 5 }}
        >
          <defs>
            {categories.map((category) => {
              const color = getDailyCategoryColor(category);
              return (
                <linearGradient
                  key={category}
                  id={`gradient-${category}`}
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
          <CartesianGrid strokeDasharray="5 5" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickLine={{ stroke: '#E5E7EB' }}
            axisLine={{ stroke: '#E5E7EB' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}K`}
            tickLine={{ stroke: '#E5E7EB' }}
            axisLine={{ stroke: '#E5E7EB' }}
            width={60}
          />
          <Tooltip content={<DailySpendingTooltip categories={categories} />} />
          <Legend wrapperStyle={{ paddingTop: 10 }} iconType="circle" iconSize={8} />
          {categories.map((category) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stackId="1"
              stroke={getDailyCategoryColor(category)}
              strokeWidth={1}
              fill={`url(#gradient-${category})`}
              fillOpacity={1}
            />
          ))}
          {enableZoom && (
            <Brush
              dataKey="date"
              height={30}
              stroke="#9CA3AF"
              tickFormatter={formatXAxis}
              startIndex={Math.max(0, data.length - 30)}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
