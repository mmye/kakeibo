import type { TooltipProps } from 'recharts';
import { CHART_COLORS } from '@/constants';

type TooltipPayload = {
  name: string;
  value: number;
  color?: string;
  dataKey?: string;
  payload?: {
    category?: string;
    subcategory?: string;
    institution?: string;
    percentage?: number;
    month?: string;
    income?: number;
    expense?: number;
    balance?: number;
    amount?: number;
    color?: string;
  };
};

type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: TooltipPayload[];
};

/**
 * 金額をフォーマット
 */
function formatAmount(value: number): string {
  return `¥${Math.abs(value).toLocaleString()}`;
}

/**
 * 折れ線グラフ用ツールチップ
 * 月、収入/支出/収支の金額を表示
 */
export function LineChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const labelMap: Record<string, string> = {
    income: '収入',
    expense: '支出',
    balance: '収支',
  };

  const colorMap: Record<string, string> = {
    income: CHART_COLORS.income,
    expense: CHART_COLORS.expense,
    balance: CHART_COLORS.balance,
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3 min-w-[140px]">
      <p className="text-sm font-semibold text-text-primary mb-2 border-b border-border pb-2">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const dataKey = entry.dataKey as string;
          const value = entry.value ?? 0;
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colorMap[dataKey] || entry.color }}
                />
                <span className="text-sm text-text-secondary">
                  {labelMap[dataKey] || entry.name}
                </span>
              </div>
              <span
                className="text-sm font-medium tabular-nums"
                style={{ color: colorMap[dataKey] || entry.color }}
              >
                {formatAmount(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 円グラフ用ツールチップ
 * カテゴリ名、金額、割合を表示
 */
export function PieChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]!;
  const category = data.name || data.payload?.category || '';
  const amount = data.value ?? data.payload?.amount ?? 0;
  const percentage = data.payload?.percentage ?? 0;
  const color = data.payload?.color || data.color || CHART_COLORS.expense;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3 min-w-[160px]">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-text-primary">{category}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-text-secondary">金額</span>
          <span className="text-sm font-medium text-text-primary tabular-nums">
            {formatAmount(amount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-text-secondary">割合</span>
          <span className="text-sm font-medium text-text-primary tabular-nums">
            {(percentage * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 棒グラフ用ツールチップ
 * カテゴリ名/サブカテゴリ名/金融機関名、金額を表示
 */
export function BarChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]!;
  // category, subcategory, institution のいずれかを取得
  const label =
    data.payload?.category ||
    data.payload?.subcategory ||
    data.payload?.institution ||
    data.name ||
    '';
  const amount = data.value ?? data.payload?.amount ?? 0;
  const color = data.payload?.color || data.color || CHART_COLORS.expense;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3 min-w-[140px]">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-text-primary">{label}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-text-secondary">金額</span>
        <span className="text-sm font-medium text-text-primary tabular-nums">
          {formatAmount(amount)}
        </span>
      </div>
    </div>
  );
}

/**
 * 収入円グラフ用ツールチップ
 * サブカテゴリ名、金額、割合を表示
 */
export function IncomePieChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]!;
  const label = data.name || data.payload?.subcategory || '';
  const amount = data.value ?? data.payload?.amount ?? 0;
  const percentage = data.payload?.percentage ?? 0;
  const color = data.color || CHART_COLORS.income;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg p-3 min-w-[160px]">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-text-primary">{label}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-text-secondary">金額</span>
          <span className="text-sm font-medium text-text-primary tabular-nums">
            {formatAmount(amount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-text-secondary">割合</span>
          <span className="text-sm font-medium text-text-primary tabular-nums">
            {(percentage * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
