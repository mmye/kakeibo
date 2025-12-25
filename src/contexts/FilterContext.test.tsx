import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FilterProvider, useFilterContext } from './FilterContext';

describe('FilterContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FilterProvider>{children}</FilterProvider>
  );

  describe('初期値', () => {
    it('デフォルト値が設定される', () => {
      const { result } = renderHook(() => useFilterContext(), { wrapper });

      expect(result.current.filters).toEqual({
        year: new Date().getFullYear(),
        month: 'all',
        category: 'all',
        institution: 'all',
        searchQuery: '',
      });
    });
  });

  describe('setFilters', () => {
    it('フィルター全体を更新できる', () => {
      const { result } = renderHook(() => useFilterContext(), { wrapper });

      act(() => {
        result.current.setFilters({
          year: 2024,
          month: 12,
          category: '食費',
          institution: '三菱UFJ銀行',
          searchQuery: 'スーパー',
        });
      });

      expect(result.current.filters).toEqual({
        year: 2024,
        month: 12,
        category: '食費',
        institution: '三菱UFJ銀行',
        searchQuery: 'スーパー',
      });
    });
  });

  describe('updateFilter', () => {
    it('単一フィールドを更新できる', () => {
      const { result } = renderHook(() => useFilterContext(), { wrapper });

      act(() => {
        result.current.updateFilter('month', 6);
      });

      expect(result.current.filters.month).toBe(6);
      expect(result.current.filters.category).toBe('all'); // 他のフィールドは変わらない
    });

    it('yearを更新できる', () => {
      const { result } = renderHook(() => useFilterContext(), { wrapper });

      act(() => {
        result.current.updateFilter('year', 2024);
      });

      expect(result.current.filters.year).toBe(2024);
    });

    it('categoryを更新できる', () => {
      const { result } = renderHook(() => useFilterContext(), { wrapper });

      act(() => {
        result.current.updateFilter('category', '食費');
      });

      expect(result.current.filters.category).toBe('食費');
    });

    it('searchQueryを更新できる', () => {
      const { result } = renderHook(() => useFilterContext(), { wrapper });

      act(() => {
        result.current.updateFilter('searchQuery', 'コンビニ');
      });

      expect(result.current.filters.searchQuery).toBe('コンビニ');
    });
  });

  describe('resetFilters', () => {
    it('デフォルト値にリセットできる', () => {
      const { result } = renderHook(() => useFilterContext(), { wrapper });

      // まず変更
      act(() => {
        result.current.setFilters({
          year: 2024,
          month: 6,
          category: '食費',
          institution: '楽天カード',
          searchQuery: 'テスト',
        });
      });

      // リセット
      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.filters).toEqual({
        year: new Date().getFullYear(),
        month: 'all',
        category: 'all',
        institution: 'all',
        searchQuery: '',
      });
    });
  });

  describe('エラー処理', () => {
    it('Provider外で使用時にエラーをスローする', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useFilterContext());
      }).toThrow('useFilterContext must be used within FilterProvider');

      consoleSpy.mockRestore();
    });
  });
});
