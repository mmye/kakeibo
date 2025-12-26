import { useMemo, useState } from 'react';
import { useFilteredData } from '@/hooks';
import { useFilterContext } from '@/contexts';
import { ChartContainer } from '../ChartContainer';
import { formatCurrency } from '@/utils/formatters';

/**
 * 金額に応じた色を計算（Cozy Comic: 青 → 黄 → ローズ）
 */
function getHeatmapColor(value: number, maxValue: number): string {
  if (value === 0) {
    return '#F3F4F6';
  } // ライトグレー（データあり、0円）

  const ratio = Math.min(value / maxValue, 1);

  // 3段階のグラデーション（Cozy Comicテーマ）
  if (ratio < 0.33) {
    // 低額: Light Blue → Blue
    const t = ratio / 0.33;
    return interpolateColor('#E0F2FE', '#38BDF8', t); // secondary-light → secondary
  } else if (ratio < 0.67) {
    // 中額: Blue → Yellow
    const t = (ratio - 0.33) / 0.34;
    return interpolateColor('#38BDF8', '#FBBF24', t); // secondary → primary
  } else {
    // 高額: Yellow → Rose
    const t = (ratio - 0.67) / 0.33;
    return interpolateColor('#FBBF24', '#F43F5E', t); // primary → expense
  }
}

/**
 * 2色間を線形補間
 */
function interpolateColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 背景色に対する適切なテキスト色を返す
 */
function getTextColor(bgColor: string): string {
  // RGBを抽出
  const match = bgColor.match(/\d+/g);
  if (!match || match.length < 3) {
    return '#374151';
  }

  const r = Number(match[0]);
  const g = Number(match[1]);
  const b = Number(match[2]);
  // 輝度計算（YIQ方式）
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#374151' : '#FFFFFF';
}

type HeatmapTooltipProps = {
  category: string;
  month: string;
  value: number;
  position: { x: number; y: number };
};

/**
 * ヒートマップ用ツールチップ
 */
function HeatmapTooltip({ category, month, value, position }: HeatmapTooltipProps) {
  return (
    <div
      className="fixed z-50 bg-surface border border-border rounded-lg shadow-lg p-3 pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)',
      }}
    >
      <p className="text-sm font-semibold text-text-primary mb-1">
        {category} / {month}
      </p>
      <p className="text-sm text-text-secondary">
        支出: <span className="font-medium text-expense">{formatCurrency(-value)}</span>
      </p>
    </div>
  );
}

/**
 * 凡例コンポーネント
 */
function HeatmapLegend({ maxValue }: { maxValue: number }) {
  const steps = [0, 0.25, 0.5, 0.75, 1];
  const labels = [
    '¥0',
    `¥${((maxValue * 0.25) / 1000).toFixed(0)}K`,
    `¥${((maxValue * 0.5) / 1000).toFixed(0)}K`,
    `¥${((maxValue * 0.75) / 1000).toFixed(0)}K`,
    `¥${(maxValue / 1000).toFixed(0)}K`,
  ];

  return (
    <div className="flex items-center gap-2 mt-4 justify-end">
      <span className="text-xs text-text-secondary">低</span>
      <div className="flex h-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="w-8 h-full"
            style={{ backgroundColor: getHeatmapColor(maxValue * step, maxValue) }}
            title={labels[index] || `¥${((maxValue * step) / 1000).toFixed(0)}K`}
          />
        ))}
      </div>
      <span className="text-xs text-text-secondary">高</span>
      <div className="flex items-center gap-1 ml-4">
        <div
          className="w-4 h-4 border border-border"
          style={{
            background:
              'repeating-linear-gradient(45deg, #E5E7EB, #E5E7EB 2px, #F9FAFB 2px, #F9FAFB 4px)',
          }}
        />
        <span className="text-xs text-text-secondary">データなし</span>
      </div>
    </div>
  );
}

/**
 * 月×カテゴリのヒートマップチャート
 * クリックでその月×カテゴリの取引をフィルター
 */
export function HeatmapChart() {
  const { data } = useFilteredData();
  const { updateFilter } = useFilterContext();
  const [tooltip, setTooltip] = useState<HeatmapTooltipProps | null>(null);

  const handleCellClick = (month: string, category: string, hasData: boolean) => {
    if (!hasData) {
      return;
    }
    const monthNum = parseInt(month);
    if (!isNaN(monthNum)) {
      updateFilter('month', monthNum);
    }
    updateFilter('category', category);
    document.getElementById('transaction-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const { months, categories, heatmapData, maxValue, existingMonths } = useMemo(() => {
    const expenses = data.filter((t) => t.amount < 0);

    // 月とカテゴリを抽出
    const monthSet = new Set<string>();
    const categorySet = new Set<string>();
    const valueMap = new Map<string, number>();

    for (const t of expenses) {
      const month = `${t.date.getMonth() + 1}月`;
      monthSet.add(month);
      categorySet.add(t.category);

      const key = `${month}-${t.category}`;
      const current = valueMap.get(key) ?? 0;
      valueMap.set(key, current + Math.abs(t.amount));
    }

    const months = Array.from(monthSet).sort((a, b) => parseInt(a) - parseInt(b));
    const categories = Array.from(categorySet);
    const maxValue = Math.max(...valueMap.values(), 1);

    // 各カテゴリでデータがある月を記録
    const existingMonths = new Map<string, Set<string>>();
    for (const [key] of valueMap) {
      const parts = key.split('-');
      const month = parts[0] ?? '';
      const category = parts.slice(1).join('-'); // カテゴリ名に'-'が含まれる場合も対応
      if (category && !existingMonths.has(category)) {
        existingMonths.set(category, new Set());
      }
      if (category && month) {
        existingMonths.get(category)!.add(month);
      }
    }

    return { months, categories, heatmapData: valueMap, maxValue, existingMonths };
  }, [data]);

  const handleMouseEnter = (
    e: React.MouseEvent,
    category: string,
    month: string,
    value: number
  ) => {
    setTooltip({
      category,
      month,
      value,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip) {
      setTooltip((prev) => (prev ? { ...prev, position: { x: e.clientX, y: e.clientY } } : null));
    }
  };

  return (
    <ChartContainer title="月別×カテゴリ ヒートマップ" height={500}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left font-medium text-text-secondary">カテゴリ</th>
              {months.map((month) => (
                <th key={month} className="p-2 text-center font-medium text-text-secondary">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category}>
                <td className="p-2 font-medium text-text-primary">{category}</td>
                {months.map((month) => {
                  const key = `${month}-${category}`;
                  const value = heatmapData.get(key) ?? 0;
                  const hasDataInMonth = existingMonths.get(category)?.has(month) ?? false;
                  const isNoData = !hasDataInMonth && value === 0;

                  const bgColor = isNoData ? 'transparent' : getHeatmapColor(value, maxValue);
                  const textColor = isNoData ? '#9CA3AF' : getTextColor(bgColor);

                  return (
                    <td
                      key={month}
                      className={`p-2 text-center text-xs transition-transform hover:scale-105 ${!isNoData ? 'cursor-pointer' : 'cursor-default'}`}
                      style={{
                        backgroundColor: isNoData ? undefined : bgColor,
                        color: textColor,
                        background: isNoData
                          ? 'repeating-linear-gradient(45deg, #E5E7EB, #E5E7EB 2px, #F9FAFB 2px, #F9FAFB 4px)'
                          : undefined,
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, category, month, value)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                      onClick={() => handleCellClick(month, category, !isNoData)}
                    >
                      {isNoData ? '-' : `¥${(value / 1000).toFixed(0)}K`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <HeatmapLegend maxValue={maxValue} />
      {tooltip && tooltip.value >= 0 && <HeatmapTooltip {...tooltip} />}
    </ChartContainer>
  );
}
