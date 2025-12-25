import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useFilteredData } from '@/hooks';
import { ChartContainer } from '../ChartContainer';
import { getCategoryColor } from '@/constants';
import { BarChartTooltip } from '../shared';

type SubcategoryChartProps = {
  category: string;
  onBack?: () => void;
};

/**
 * 中項目ドリルダウンチャート
 * カテゴリ内の中項目内訳を横棒グラフで表示
 */
export function SubcategoryChart({ category, onBack }: SubcategoryChartProps) {
  const { data } = useFilteredData();

  // カテゴリ内の中項目を集計
  const subcategoryData = useMemo(() => {
    const filtered = data.filter((t) => t.category === category && t.amount < 0);
    const bySubcategory = new Map<string, number>();

    for (const t of filtered) {
      const current = bySubcategory.get(t.subcategory) ?? 0;
      bySubcategory.set(t.subcategory, current + Math.abs(t.amount));
    }

    return Array.from(bySubcategory.entries())
      .map(([subcategory, amount]) => ({ subcategory, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [data, category]);

  const color = getCategoryColor(category);

  return (
    <ChartContainer title={`${category}の内訳`} height={300}>
      {onBack && (
        <button onClick={onBack} className="text-sm text-primary hover:underline mb-2">
          ← 戻る
        </button>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={subcategoryData} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}K`}
          />
          <YAxis type="category" dataKey="subcategory" tick={{ fontSize: 12 }} width={100} />
          <Tooltip content={<BarChartTooltip />} />
          <Bar dataKey="amount" name="支出" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
