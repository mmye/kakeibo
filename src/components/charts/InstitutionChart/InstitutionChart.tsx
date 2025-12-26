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
import { useInstitutionSummary } from '@/hooks';
import { useFilterContext } from '@/contexts';
import { ChartContainer } from '../ChartContainer';
import { CATEGORIES } from '@/constants';
import { BarChartTooltip } from '../shared';
import { formatCurrency } from '@/utils';

// カテゴリ色の配列を生成
const INSTITUTION_COLORS = Object.values(CATEGORIES).map((c) => c.color);

/**
 * 金融機関別支出チャート
 * クリックでその金融機関の取引をフィルター
 */
export function InstitutionChart() {
  const data = useInstitutionSummary();
  const { updateFilter } = useFilterContext();

  // スクリーンリーダー用のサマリーを生成
  const ariaLabel = useMemo(() => {
    if (data.length === 0) {
      return '金融機関別支出グラフ。データがありません。';
    }
    const top3 = data.slice(0, 3);
    const summary = top3.map((d) => `${d.institution}${formatCurrency(d.amount)}`).join('、');
    return `金融機関別支出グラフ。${data.length}機関。上位3機関：${summary}。金融機関をクリックすると、その取引が表示されます。`;
  }, [data]);

  const handleInstitutionClick = (institution: string) => {
    updateFilter('institution', institution);
    document.getElementById('transaction-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ChartContainer title="金融機関別支出" height={400} aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}K`}
          />
          <YAxis type="category" dataKey="institution" tick={{ fontSize: 11 }} width={120} />
          <Tooltip content={<BarChartTooltip />} />
          <Bar
            dataKey="amount"
            name="支出"
            onClick={(data) => handleInstitutionClick(data.institution)}
            style={{ cursor: 'pointer' }}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={INSTITUTION_COLORS[index % INSTITUTION_COLORS.length]}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
