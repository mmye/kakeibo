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
import { ChartContainer } from '../ChartContainer';
import { CATEGORIES } from '@/constants';

// カテゴリ色の配列を生成
const INSTITUTION_COLORS = Object.values(CATEGORIES).map((c) => c.color);

/**
 * 金融機関別支出チャート
 */
export function InstitutionChart() {
  const data = useInstitutionSummary();

  return (
    <ChartContainer title="金融機関別支出" height={400}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}K`}
          />
          <YAxis type="category" dataKey="institution" tick={{ fontSize: 11 }} width={120} />
          <Tooltip
            formatter={(value: number) => `¥${value.toLocaleString()}`}
            contentStyle={{ borderRadius: 8 }}
          />
          <Bar dataKey="amount" name="支出">
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={INSTITUTION_COLORS[index % INSTITUTION_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
