import { Select } from '@/components/ui';
import { useFilterContext } from '@/contexts';

const YEARS = [2025, 2024, 2023];
const MONTHS = [
  { value: 'all', label: '全期間' },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}月`,
  })),
];

/**
 * 期間フィルター（年・月）
 */
export function PeriodFilter() {
  const { filters, updateFilter } = useFilterContext();

  return (
    <div className="flex gap-2">
      <Select
        label="年"
        value={String(filters.year)}
        options={YEARS.map((y) => ({ value: String(y), label: `${y}年` }))}
        onChange={(e) => updateFilter('year', Number(e.target.value))}
      />
      <Select
        label="月"
        value={filters.month === 'all' ? 'all' : String(filters.month)}
        options={MONTHS}
        onChange={(e) => {
          const value = e.target.value;
          updateFilter('month', value === 'all' ? 'all' : Number(value));
        }}
      />
    </div>
  );
}
