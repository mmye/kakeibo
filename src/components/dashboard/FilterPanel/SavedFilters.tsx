import { useState } from 'react';
import { Star, Trash2, ChevronDown } from 'lucide-react';
import { useSavedFilters } from '@/hooks';
import { useFilterContext } from '@/contexts';
import { Button } from '@/components/ui';
import type { SavedFilter } from '@/types';

/**
 * 保存されたフィルター管理コンポーネント
 */
export function SavedFilters() {
  const { filters, setFilters } = useFilterContext();
  const { savedFilters, saveFilter, deleteFilter, applyFilter } = useSavedFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleSave = () => {
    if (!filterName.trim()) {
      return;
    }
    saveFilter(filterName.trim(), filters);
    setFilterName('');
    setIsSaveDialogOpen(false);
  };

  const handleApply = (savedFilter: SavedFilter) => {
    const newFilters = applyFilter(savedFilter, filters);
    setFilters(newFilters);
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteFilter(id);
  };

  // フィルターがアクティブかどうか
  const hasActiveFilter =
    filters.month !== 'all' ||
    filters.category !== 'all' ||
    filters.institution !== 'all' ||
    filters.searchQuery !== '';

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* 保存ボタン */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSaveDialogOpen(true)}
          disabled={!hasActiveFilter}
          title={hasActiveFilter ? '現在のフィルターを保存' : 'フィルターを設定してください'}
        >
          <Star size={16} className="mr-1" />
          保存
        </Button>

        {/* 保存済みフィルタードロップダウン */}
        {savedFilters.length > 0 && (
          <div className="relative">
            <Button variant="secondary" size="sm" onClick={() => setIsOpen(!isOpen)}>
              保存済み ({savedFilters.length})
              <ChevronDown size={16} className="ml-1" />
            </Button>

            {isOpen && (
              <>
                {/* オーバーレイ */}
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                {/* ドロップダウンメニュー */}
                <div className="absolute right-0 mt-1 w-64 bg-surface border border-border rounded-lg shadow-lg z-20">
                  <div className="p-2 text-xs text-text-secondary border-b border-border">
                    保存済みフィルター
                  </div>
                  <ul className="max-h-60 overflow-y-auto">
                    {savedFilters.map((sf) => (
                      <li key={sf.id}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => handleApply(sf)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleApply(sf);
                            }
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-border/50 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-text-primary truncate">{sf.name}</div>
                            <div className="text-xs text-text-secondary truncate">
                              {formatFilterSummary(sf)}
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDelete(e, sf.id)}
                            className="p-1 text-text-tertiary hover:text-expense transition-colors"
                            title="削除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 保存ダイアログ */}
      {isSaveDialogOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSaveDialogOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-surface rounded-lg shadow-xl z-40 p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">フィルターを保存</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">フィルター名</label>
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="例: 今月の食費"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    }
                  }}
                />
              </div>
              <div className="text-sm text-text-secondary">
                <div className="font-medium mb-1">保存される条件:</div>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  {filters.month !== 'all' && <li>月: {filters.month}月</li>}
                  {filters.category !== 'all' && <li>カテゴリ: {filters.category}</li>}
                  {filters.institution !== 'all' && <li>金融機関: {filters.institution}</li>}
                  {filters.searchQuery && <li>検索: {filters.searchQuery}</li>}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsSaveDialogOpen(false)}
                  className="flex-1"
                >
                  キャンセル
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={!filterName.trim()}
                  className="flex-1"
                >
                  保存
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * 保存されたフィルターの概要を生成
 */
function formatFilterSummary(sf: SavedFilter): string {
  const parts: string[] = [];
  if (sf.filter.month !== 'all') {
    parts.push(`${sf.filter.month}月`);
  }
  if (sf.filter.category !== 'all') {
    parts.push(sf.filter.category);
  }
  if (sf.filter.institution !== 'all') {
    parts.push(sf.filter.institution);
  }
  if (sf.filter.searchQuery) {
    parts.push(`"${sf.filter.searchQuery}"`);
  }
  return parts.join(' / ') || '条件なし';
}
