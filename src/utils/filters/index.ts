import type { Transaction, FilterState, SortState } from '@/types';

// Date filters
export { filterByMonth, filterByYear, filterByDateRange } from './dateFilter';

// Category filters
export {
  filterByCategory,
  filterBySubcategory,
  filterByInstitution,
  filterBySearchQuery,
} from './categoryFilter';

/**
 * フィルター状態を適用
 */
export function applyFilters(transactions: Transaction[], filters: FilterState): Transaction[] {
  let result = transactions;

  // 年
  result = result.filter((t) => t.date.getFullYear() === filters.year);

  // 月
  if (filters.month !== 'all') {
    result = result.filter((t) => t.date.getMonth() + 1 === filters.month);
  }

  // カテゴリ
  if (filters.category !== 'all') {
    result = result.filter((t) => t.category === filters.category);
  }

  // 金融機関
  if (filters.institution !== 'all') {
    result = result.filter((t) => t.institution === filters.institution);
  }

  // 検索
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter((t) => t.description.toLowerCase().includes(query));
  }

  return result;
}

/**
 * ソートを適用
 */
export function applySort(transactions: Transaction[], sort: SortState): Transaction[] {
  const sorted = [...transactions];
  const { column, direction } = sort;
  const multiplier = direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    switch (column) {
      case 'date':
        return multiplier * (a.date.getTime() - b.date.getTime());
      case 'amount':
        return multiplier * (a.amount - b.amount);
      case 'category':
        return multiplier * a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return sorted;
}

/**
 * ページネーションを適用
 */
export function applyPagination<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; totalPages: number } {
  const start = page * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    totalPages: Math.ceil(items.length / pageSize),
  };
}
