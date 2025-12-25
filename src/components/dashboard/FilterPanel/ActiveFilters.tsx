import { useMemo } from 'react';
import { FilterChip } from './FilterChip';
import { useFilterContext } from '@/contexts';
import type { FilterState } from '@/types';

type ActiveFilter = {
  key: keyof FilterState;
  label: string;
  value: string;
  displayValue: string;
};

/**
 * 現在のフィルター状態から表示用のフィルター情報を生成
 */
function getActiveFilters(filters: FilterState): ActiveFilter[] {
  const activeFilters: ActiveFilter[] = [];

  // 年は常に表示（デフォルトの概念がないため除外も検討したが、明示的な方が分かりやすい）
  // ただし今回は他のフィルターが何も適用されていないときは非表示とする

  // 月（'all'以外の場合のみ表示）
  if (filters.month !== 'all') {
    activeFilters.push({
      key: 'month',
      label: '月',
      value: String(filters.month),
      displayValue: `${filters.month}月`,
    });
  }

  // カテゴリ（'all'以外の場合のみ表示）
  if (filters.category !== 'all') {
    activeFilters.push({
      key: 'category',
      label: 'カテゴリ',
      value: filters.category,
      displayValue: filters.category,
    });
  }

  // 金融機関（'all'以外の場合のみ表示）
  if (filters.institution !== 'all') {
    activeFilters.push({
      key: 'institution',
      label: '金融機関',
      value: filters.institution,
      displayValue: filters.institution,
    });
  }

  // 検索（空でない場合のみ表示）
  if (filters.searchQuery.trim() !== '') {
    activeFilters.push({
      key: 'searchQuery',
      label: '検索',
      value: filters.searchQuery,
      displayValue: filters.searchQuery,
    });
  }

  return activeFilters;
}

/**
 * アクティブフィルター表示
 * 適用中のフィルターをチップ形式で表示
 */
export function ActiveFilters() {
  const { filters, updateFilter, resetFilters } = useFilterContext();

  const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);

  // アクティブなフィルターがない場合は何も表示しない
  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemoveFilter = (key: keyof FilterState) => {
    switch (key) {
      case 'month':
        updateFilter('month', 'all');
        break;
      case 'category':
        updateFilter('category', 'all');
        break;
      case 'institution':
        updateFilter('institution', 'all');
        break;
      case 'searchQuery':
        updateFilter('searchQuery', '');
        break;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
      <span className="text-sm text-text-secondary">適用中:</span>
      {activeFilters.map((filter) => (
        <FilterChip
          key={filter.key}
          label={filter.label}
          value={filter.displayValue}
          onRemove={() => handleRemoveFilter(filter.key)}
        />
      ))}
      {activeFilters.length > 1 && (
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm text-text-secondary hover:text-primary underline transition-colors ml-2"
        >
          すべてクリア
        </button>
      )}
    </div>
  );
}
