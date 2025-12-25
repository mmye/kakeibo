import { Select } from '@/components/ui';
import { useFilterContext, useTransactionContext } from '@/contexts';
import { useMemo } from 'react';

/**
 * カテゴリフィルター
 */
export function CategoryFilter() {
  const { filters, updateFilter } = useFilterContext();
  const { transactions } = useTransactionContext();

  // トランザクションからカテゴリ一覧を抽出
  const categories = useMemo(() => {
    const categorySet = new Set(transactions.map((t) => t.category));
    return Array.from(categorySet).sort();
  }, [transactions]);

  const options = [
    { value: 'all', label: 'すべて' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  return (
    <Select
      label="カテゴリ"
      value={filters.category}
      options={options}
      onChange={(e) => updateFilter('category', e.target.value)}
    />
  );
}
