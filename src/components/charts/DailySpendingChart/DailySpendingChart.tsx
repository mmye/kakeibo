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
 * Format amount for display
 */
function formatAmount(value: number): string {
  return `¥${value.toLocaleString()}`;
}

/**
 * Custom tooltip matching prototype style
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

  const dataPoint = payload[0] as unknown as { payload?: DailySpendingData };
  const dayOfWeek = dataPoint?.payload?.dayOfWeek || '';
  const total = dataPoint?.payload?.total || 0;

  // Format date as YYYY.MM.DD
  const formattedDate = label?.replace(/-/g, '.') || '';

  return (
    <div className="bg-white/[0.98] rounded-xl shadow-lg p-4 min-w-[200px] border-0">
      <p className="text-xs text-text-secondary mb-2">
        {formattedDate} ({dayOfWeek})
      </p>
      <table className="w-full">
        <tbody>
          {payload
            .filter((entry) => categories.includes(entry.dataKey) && entry.value > 0)
            .map((entry, index) => (
              <tr key={index}>
                <td className="py-1 font-bold" style={{ color: entry.color }}>
                  ● {entry.dataKey}:
                </td>
                <td className="py-1 text-right font-bold text-text-primary tabular-nums">
                  {formatAmount(entry.value)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-2 pt-2 border-t border-dashed border-gray-200 text-right">
        <span className="font-extrabold text-text-primary">Total: {formatAmount(total)}</span>
      </div>
    </div>
  );
}

/**
 * Decorative corner marker component
 */
function CornerMarker({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const positionClasses = {
    tl: 'top-4 left-4 border-t-2 border-l-2 rounded-tl-lg',
    tr: 'top-4 right-4 border-t-2 border-r-2 rounded-tr-lg',
    bl: 'bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg',
    br: 'bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg',
  };

  return <div className={`absolute w-3 h-3 border-gray-300 ${positionClasses[position]}`} />;
}

/**
 * Mini sparkline component for observation panel
 */
function MiniSparkline() {
  const heights = [2, 4, 6, 3, 5, 4, 7, 3, 5];
  return (
    <div className="flex space-x-0.5 items-end h-8">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full"
          style={{
            height: `${h * 4}px`,
            backgroundColor: i === 2 || i === 6 ? '#FBBF24' : '#E5E7EB',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Daily Spending Wave Chart
 * Scientific Comic Style - Stacked area chart showing daily expenses by category
 */
export function DailySpendingChart({ enableZoom = true, height = 500 }: DailySpendingChartProps) {
  const { data, categories, totalSpending, averageDaily, peakDay } = useDailySpending();

  // Generate aria label for accessibility
  const ariaLabel = useMemo(() => {
    if (data.length === 0) {
      return 'Daily Expenditure Wave chart. No data available.';
    }
    return `Daily Expenditure Wave chart. ${data.length} days of data. Total ${formatCurrency(totalSpending)}, daily average ${formatCurrency(averageDaily)}.`;
  }, [data.length, totalSpending, averageDaily]);

  // Format X-axis date label
  const formatXAxis = (date: string) => {
    const parts = date.split('-');
    if (parts.length === 3 && parts[1] && parts[2]) {
      return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    }
    return date;
  };

  // Find top spending category
  const topCategory = useMemo(() => {
    if (categories.length === 0) {
      return null;
    }
    const categoryTotals = categories.map((cat) => ({
      category: cat,
      total: data.reduce((sum, d) => sum + (Number(d[cat]) || 0), 0),
    }));
    categoryTotals.sort((a, b) => b.total - a.total);
    return categoryTotals[0] ?? null;
  }, [data, categories]);

  if (data.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-dashed border-gray-300 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              Daily Expenditure Wave
            </h2>
            <p className="text-text-secondary mt-1 text-sm font-medium">
              Precision Analysis Module <span className="mx-2">|</span> Zoomable Time-Series
            </p>
          </div>
        </div>

        {/* Empty Chart Container */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
          <CornerMarker position="tl" />
          <CornerMarker position="tr" />
          <CornerMarker position="bl" />
          <CornerMarker position="br" />
          <div
            className="flex items-center justify-center text-text-secondary"
            style={{ height }}
            role="img"
            aria-label={ariaLabel}
          >
            表示するデータがありません
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b-2 border-dashed border-gray-300 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
            Daily Expenditure Wave
          </h2>
          <p className="text-text-secondary mt-1 text-sm font-medium">
            Precision Analysis Module <span className="mx-2">|</span> Zoomable Time-Series
          </p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs text-text-secondary font-bold uppercase tracking-widest">
            Total Spent ({data.length} Days)
          </div>
          <div className="text-2xl md:text-3xl font-bold tabular-nums text-[#F43F5E]">
            {formatAmount(totalSpending)}
          </div>
        </div>
      </div>

      {/* Chart Container with Scientific Corner Markers */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
        <CornerMarker position="tl" />
        <CornerMarker position="tr" />
        <CornerMarker position="bl" />
        <CornerMarker position="br" />

        <div style={{ height }} role="img" aria-label={ariaLabel} tabIndex={0}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: enableZoom ? 50 : 5 }}
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
              <CartesianGrid strokeDasharray="8 4" stroke="#F3F4F6" vertical={true} />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6B7280' }}
                tickFormatter={(v) => `¥${v.toLocaleString()}`}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                width={70}
              />
              <Tooltip
                content={<DailySpendingTooltip categories={categories} />}
                cursor={{ stroke: '#1F2937', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 16 }}
                iconType="circle"
                iconSize={10}
                formatter={(value) => (
                  <span className="text-text-primary font-semibold text-sm">{value}</span>
                )}
              />
              {categories.map((category) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stackId="1"
                  stroke="#ffffff"
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
                  fill="#FAFAFA"
                  tickFormatter={formatXAxis}
                  startIndex={Math.max(0, data.length - 30)}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Info Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary">
        {/* Interaction Guide */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <strong className="block text-text-primary mb-2">Interaction Guide</strong>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>
              Drag chart area to <strong className="text-text-primary">Zoom In</strong>
            </li>
            <li>
              Hover to see <strong className="text-text-primary">Detailed Breakdown</strong>
            </li>
            <li>
              Click legend to <strong className="text-text-primary">Toggle Categories</strong>
            </li>
          </ul>
        </div>

        {/* Observation Panel */}
        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <strong className="block text-text-primary mb-1">Observation</strong>
            <p className="text-xs">
              {topCategory && (
                <>
                  Top spending:{' '}
                  <span
                    className="font-bold"
                    style={{ color: getDailyCategoryColor(topCategory.category) }}
                  >
                    {topCategory.category}
                  </span>{' '}
                  ({formatAmount(topCategory.total)}).
                </>
              )}{' '}
              {peakDay && (
                <>
                  Peak day:{' '}
                  <span className="font-bold text-text-primary">
                    {peakDay.date.replace(/-/g, '/')}
                  </span>{' '}
                  ({formatAmount(peakDay.amount)}).
                </>
              )}
            </p>
          </div>
          <MiniSparkline />
        </div>
      </div>
    </div>
  );
}
