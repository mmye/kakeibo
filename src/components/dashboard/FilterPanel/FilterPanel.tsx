import { PeriodFilter } from './PeriodFilter';
import { CategoryFilter } from './CategoryFilter';
import { InstitutionFilter } from './InstitutionFilter';
import { SearchInput } from '@/components/ui';
import { useFilterContext } from '@/contexts';

/**
 * フィルターパネル
 * 期間・カテゴリ・金融機関・検索のフィルターを表示
 */
export function FilterPanel() {
  const { filters, updateFilter } = useFilterContext();

  return (
    <div className="bg-surface rounded-lg shadow-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PeriodFilter />
        <CategoryFilter />
        <InstitutionFilter />
        <SearchInput
          value={filters.searchQuery}
          onChange={(value) => updateFilter('searchQuery', value)}
          placeholder="内容を検索..."
        />
      </div>
    </div>
  );
}
