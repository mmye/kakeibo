import { useState, useMemo } from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import { Table, TableHeader, TableRow, TableCell, Amount } from '@/components/ui';
import { useFilteredData, useAnomalyDetection } from '@/hooks';
import { useFilterContext } from '@/contexts';
import { formatDate } from '@/utils/formatters';
import { getAnomalyLabel } from '@/utils/calculations';
import { exportTransactionsToCSV } from '@/utils/export';
import { cn } from '@/utils';
import { TablePagination } from './TablePagination';
import { TransactionCard } from './TransactionCard';
import type { SortState } from '@/types';

const PAGE_SIZE = 20;

export function TransactionTable() {
  const { data, filteredCount } = useFilteredData();
  const anomalyMap = useAnomalyDetection();
  const { filters } = useFilterContext();
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

  const handleExport = () => {
    if (sortedData.length === 0) {
      return;
    }
    exportTransactionsToCSV(sortedData, filters.year, filters.month);
  };

  const handleSort = (column: SortState['column']) => {
    setSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
    setPage(0);
  };

  return (
    <div className="bg-surface rounded-lg shadow-md overflow-hidden">
      {/* モバイル: カード形式 */}
      <div className="md:hidden">
        {/* ソートボタンとエクスポート */}
        <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">並び替え:</span>
            <button
              onClick={() => handleSort('date')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                sort.column === 'date'
                  ? 'bg-primary text-white'
                  : 'bg-border text-text-secondary hover:bg-border-strong'
              }`}
            >
              日付 {sort.column === 'date' && (sort.direction === 'asc' ? '▲' : '▼')}
            </button>
            <button
              onClick={() => handleSort('amount')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                sort.column === 'amount'
                  ? 'bg-primary text-white'
                  : 'bg-border text-text-secondary hover:bg-border-strong'
              }`}
            >
              金額 {sort.column === 'amount' && (sort.direction === 'asc' ? '▲' : '▼')}
            </button>
          </div>
          <button
            onClick={handleExport}
            disabled={sortedData.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="CSVをダウンロード"
          >
            <Download size={16} />
            <span className="sr-only sm:not-sr-only">CSV</span>
          </button>
        </div>

        {/* カードリスト */}
        <div className="p-4 space-y-3">
          {paginatedData.map((t) => (
            <TransactionCard key={t.id} transaction={t} anomalies={anomalyMap.get(t.id)} />
          ))}
        </div>
      </div>

      {/* デスクトップ: テーブル形式 */}
      <div className="hidden md:block">
        {/* ヘッダー：エクスポートボタン */}
        <div className="flex justify-end p-4 border-b border-border">
          <button
            onClick={handleExport}
            disabled={sortedData.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            CSVダウンロード
          </button>
        </div>
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
            {paginatedData.map((t) => {
              const anomalies = anomalyMap.get(t.id) || [];
              const hasAnomaly = anomalies.length > 0;

              return (
                <TableRow
                  key={t.id}
                  className={cn(hasAnomaly && 'bg-warning-light/30 hover:bg-warning-light/50')}
                >
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {hasAnomaly && (
                        <span
                          className="inline-flex items-center"
                          title={anomalies.map((a) => a.reason).join('\n')}
                        >
                          <AlertTriangle size={14} className="text-warning" />
                        </span>
                      )}
                      {formatDate(t.date)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="line-clamp-2" title={t.description}>
                        {t.description}
                      </span>
                      {hasAnomaly && (
                        <div className="flex gap-1 flex-shrink-0">
                          {anomalies.map((anomaly, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-warning/20 text-warning"
                              title={anomaly.reason}
                            >
                              {getAnomalyLabel(anomaly.type)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {t.category} / {t.subcategory}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{t.institution}</TableCell>
                  <TableCell align="right" numeric className="whitespace-nowrap">
                    <Amount value={t.amount} size="sm" />
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </div>

      <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
