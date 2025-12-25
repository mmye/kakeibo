import { useMemo } from 'react';
import { useFilteredData } from '@/hooks';
import { ChartContainer } from '../ChartContainer';
import { formatCurrency } from '@/utils/formatters';
import { getCategoryColor } from '@/constants';

/**
 * 月×カテゴリのヒートマップチャート
 */
export function HeatmapChart() {
  const { data } = useFilteredData();

  const { months, categories, heatmapData, maxValue } = useMemo(() => {
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

    return { months, categories, heatmapData: valueMap, maxValue };
  }, [data]);

  const getOpacity = (value: number) => {
    return 0.2 + (value / maxValue) * 0.8;
  };

  return (
    <ChartContainer title="月別×カテゴリ ヒートマップ" height={500}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">カテゴリ</th>
              {months.map((month) => (
                <th key={month} className="p-2 text-center">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category}>
                <td className="p-2 font-medium">{category}</td>
                {months.map((month) => {
                  const key = `${month}-${category}`;
                  const value = heatmapData.get(key) ?? 0;
                  const color = getCategoryColor(category);

                  return (
                    <td
                      key={month}
                      className="p-2 text-center text-xs"
                      style={{
                        backgroundColor: value > 0 ? color : 'transparent',
                        opacity: value > 0 ? getOpacity(value) : 1,
                        color: value > 0 ? 'white' : 'inherit',
                      }}
                      title={formatCurrency(-value)}
                    >
                      {value > 0 ? `¥${(value / 1000).toFixed(0)}K` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartContainer>
  );
}
