import { useState, useCallback, useEffect } from 'react';
import type { SavedFilter, FilterState } from '@/types';

const STORAGE_KEY = 'kakeibo-saved-filters';

/**
 * 保存済みフィルターを管理するフック
 */
export function useSavedFilters() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  // LocalStorageから読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedFilter[];
        setSavedFilters(parsed);
      }
    } catch {
      // LocalStorageが使えない場合は空配列のまま
    }
  }, []);

  // LocalStorageに保存
  const persistFilters = useCallback((filters: SavedFilter[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // LocalStorageが使えない場合は無視
    }
  }, []);

  // フィルターを保存
  const saveFilter = useCallback(
    (name: string, filter: FilterState) => {
      const newFilter: SavedFilter = {
        id: crypto.randomUUID(),
        name,
        filter: {
          month: filter.month,
          category: filter.category,
          institution: filter.institution,
          searchQuery: filter.searchQuery,
        },
        createdAt: Date.now(),
      };
      const updated = [...savedFilters, newFilter];
      setSavedFilters(updated);
      persistFilters(updated);
      return newFilter;
    },
    [savedFilters, persistFilters]
  );

  // フィルターを削除
  const deleteFilter = useCallback(
    (id: string) => {
      const updated = savedFilters.filter((f) => f.id !== id);
      setSavedFilters(updated);
      persistFilters(updated);
    },
    [savedFilters, persistFilters]
  );

  // フィルターを適用（現在のFilterStateに保存されたフィルターをマージ）
  const applyFilter = useCallback(
    (savedFilter: SavedFilter, currentFilters: FilterState): FilterState => {
      return {
        ...currentFilters,
        month: savedFilter.filter.month,
        category: savedFilter.filter.category,
        institution: savedFilter.filter.institution,
        searchQuery: savedFilter.filter.searchQuery,
      };
    },
    []
  );

  return {
    savedFilters,
    saveFilter,
    deleteFilter,
    applyFilter,
  };
}
