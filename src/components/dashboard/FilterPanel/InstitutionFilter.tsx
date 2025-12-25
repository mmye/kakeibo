import { Select } from '@/components/ui';
import { useFilterContext, useTransactionContext } from '@/contexts';
import { useMemo } from 'react';

/**
 * 金融機関フィルター
 */
export function InstitutionFilter() {
  const { filters, updateFilter } = useFilterContext();
  const { transactions } = useTransactionContext();

  // トランザクションから金融機関一覧を抽出
  const institutions = useMemo(() => {
    const institutionSet = new Set(transactions.map((t) => t.institution));
    return Array.from(institutionSet).sort();
  }, [transactions]);

  const options = [
    { value: 'all', label: 'すべて' },
    ...institutions.map((i) => ({ value: i, label: i })),
  ];

  return (
    <Select
      label="金融機関"
      value={filters.institution}
      options={options}
      onChange={(e) => updateFilter('institution', e.target.value)}
    />
  );
}
