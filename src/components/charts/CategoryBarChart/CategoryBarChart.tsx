import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { useCategorySummary } from '@/hooks';
import { useFilterContext } from '@/contexts';
import { ChartContainer } from '../ChartContainer';
import { BarChartTooltip } from '../shared';
import { formatCurrency } from '@/utils';
import { CATEGORIES, getCategoryColor } from '@/constants';

// 支出カテゴリのリスト（収入を除く）
const EXPENSE_CATEGORIES = Object.keys(CATEGORIES).filter((c) => c !== '収入');

/**
 * カテゴリ別支出の横棒グラフ
 * クリックでそのカテゴリの取引をフィルター
 */
export function CategoryBarChart() {
  const summaryData = useCategorySummary();
  const { updateFilter } = useFilterContext();

  // 全カテゴリのデータを作成（データがないカテゴリは金額0）
  const data = useMemo(() => {
    // サマリーデータをカテゴリ名でインデックス化
    const summaryMap = new Map(summaryData.map((d) => [d.category, d]));

    // 全カテゴリのデータを生成
    return EXPENSE_CATEGORIES.map((category) => {
      const existing = summaryMap.get(category);
      return {
        category,
        amount: existing?.amount ?? 0,
        percentage: existing?.percentage ?? 0,
        color: getCategoryColor(category),
      };
    }).sort((a, b) => b.amount - a.amount); // 金額降順でソート
  }, [summaryData]);

  // スクリーンリーダー用のサマリーを生成
  const ariaLabel = useMemo(() => {
    if (data.length === 0) {
      return 'カテゴリ別支出棒グラフ。データがありません。';
    }
    const top3 = data.slice(0, 3);
    const summary = top3.map((d) => `${d.category}${formatCurrency(d.amount)}`).join('、');
    return `カテゴリ別支出棒グラフ。${data.length}カテゴリ。上位3カテゴリ：${summary}。カテゴリをクリックすると、その取引が表示されます。`;
  }, [data]);

  const handleCategoryClick = (category: string) => {
    updateFilter('category', category);
    document.getElementById('transaction-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ChartContainer title="カテゴリ別支出（棒グラフ）" height={400} aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}K`}
          />
          <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={80} />
          <Tooltip content={<BarChartTooltip />} />
          <Bar
            dataKey="amount"
            name="支出"
            onClick={(data) => handleCategoryClick(data.category)}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} style={{ cursor: 'pointer' }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
