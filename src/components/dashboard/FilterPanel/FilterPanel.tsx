import { useState, useMemo } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { PeriodFilter } from './PeriodFilter';
import { CategoryFilter } from './CategoryFilter';
import { InstitutionFilter } from './InstitutionFilter';
import { ActiveFilters } from './ActiveFilters';
import { SavedFilters } from './SavedFilters';
import { SearchInput, Button } from '@/components/ui';
import { useFilterContext } from '@/contexts';
import { cn } from '@/utils';

/**
 * フィルターパネル
 * モバイル: 折りたたみ式パネル
 * デスクトップ: 常時表示のグリッドレイアウト
 */
export function FilterPanel() {
  const { filters, updateFilter, resetFilters } = useFilterContext();
  const [isExpanded, setIsExpanded] = useState(false);

  // アクティブなフィルター数を計算
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.month !== 'all') {
      count++;
    }
    if (filters.category !== 'all') {
      count++;
    }
    if (filters.institution !== 'all') {
      count++;
    }
    if (filters.searchQuery) {
      count++;
    }
    return count;
  }, [filters]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleReset = () => {
    resetFilters();
    setIsExpanded(false);
  };

  return (
    <div className="bg-surface rounded-lg shadow-md">
      {/* モバイル: 折りたたみ式 */}
      <div className="md:hidden">
        {/* ヘッダーボタン */}
        <button onClick={toggleExpanded} className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-text-secondary" />
            <span className="font-medium text-text-primary">フィルター</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-text-secondary" />
          ) : (
            <ChevronDown size={20} className="text-text-secondary" />
          )}
        </button>

        {/* 展開時のフィルター内容 */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="p-4 pt-0 space-y-4 border-t border-border">
            <PeriodFilter />
            <CategoryFilter />
            <InstitutionFilter />
            <SearchInput
              value={filters.searchQuery}
              onChange={(value) => updateFilter('searchQuery', value)}
              placeholder="内容を検索..."
            />

            {/* アクションボタン */}
            <div className="flex flex-col gap-2 pt-2">
              <SavedFilters />
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleReset} className="flex-1">
                  <X size={16} className="mr-1" />
                  リセット
                </Button>
                <Button variant="primary" onClick={() => setIsExpanded(false)} className="flex-1">
                  適用
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* デスクトップ: 常時表示 */}
      <div className="hidden md:block p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <PeriodFilter />
            <CategoryFilter />
            <InstitutionFilter />
            <SearchInput
              value={filters.searchQuery}
              onChange={(value) => updateFilter('searchQuery', value)}
              placeholder="内容を検索..."
            />
          </div>
          <SavedFilters />
        </div>
        <ActiveFilters />
      </div>
    </div>
  );
}
