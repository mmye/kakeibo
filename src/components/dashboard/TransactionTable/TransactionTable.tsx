import { useState, useMemo } from 'react';
import { Table, TableHeader, TableRow, TableCell, Amount } from '@/components/ui';
import { useFilteredData } from '@/hooks';
import { formatDate } from '@/utils/formatters';
import { TablePagination } from './TablePagination';
import type { SortState } from '@/types';

const PAGE_SIZE = 20;

export function TransactionTable() {
  const { data, filteredCount } = useFilteredData();
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<SortState>({ column: 'date', direction: 'desc' });

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const multiplier = sort.direction === 'asc' ? 1 : -1;
      if (sort.column === 'date') {
        return multiplier * (a.date.getTime() - b.date.getTime());
      }
      if (sort.column === 'amount') {
        return multiplier * (a.amount - b.amount);
      }
      return 0;
    });
  }, [data, sort]);

  const paginatedData = sortedData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));

  const handleSort = (column: SortState['column']) => {
    setSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
    setPage(0);
  };

  return (
    <div className="bg-surface rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableCell
            header
            onClick={() => handleSort('date')}
            className="cursor-pointer hover:bg-border/20"
          >
            日付 {sort.column === 'date' && (sort.direction === 'asc' ? '▲' : '▼')}
          </TableCell>
          <TableCell header>内容</TableCell>
          <TableCell header>カテゴリ</TableCell>
          <TableCell header>金融機関</TableCell>
          <TableCell
            header
            align="right"
            onClick={() => handleSort('amount')}
            className="cursor-pointer hover:bg-border/20"
          >
            金額 {sort.column === 'amount' && (sort.direction === 'asc' ? '▲' : '▼')}
          </TableCell>
        </TableHeader>
        <tbody>
          {paginatedData.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="whitespace-nowrap">{formatDate(t.date)}</TableCell>
              <TableCell className="max-w-md">
                <span className="line-clamp-2" title={t.description}>
                  {t.description}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {t.category} / {t.subcategory}
              </TableCell>
              <TableCell className="whitespace-nowrap">{t.institution}</TableCell>
              <TableCell align="right" numeric className="whitespace-nowrap">
                <Amount value={t.amount} size="sm" />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
