/**
 * フィルター状態
 */
export type FilterState = {
  /** 年 */
  year: number;
  /** 月（'all' は全月） */
  month: number | 'all';
  /** カテゴリ（'all' は全カテゴリ） */
  category: string | 'all';
  /** 金融機関（'all' は全機関） */
  institution: string | 'all';
  /** 検索クエリ */
  searchQuery: string;
};

/**
 * デフォルトのフィルター状態
 */
export const defaultFilterState: FilterState = {
  year: new Date().getFullYear(),
  month: 'all',
  category: 'all',
  institution: 'all',
  searchQuery: '',
};

/**
 * ソート方向
 */
export type SortDirection = 'asc' | 'desc';

/**
 * ソート可能なカラム
 */
export type SortableColumn = 'date' | 'amount' | 'category';

/**
 * ソート状態
 */
export type SortState = {
  column: SortableColumn;
  direction: SortDirection;
};

/**
 * ページネーション状態
 */
export type PaginationState = {
  page: number;
  pageSize: number;
};

/**
 * 保存されたフィルター
 */
export type SavedFilter = {
  /** ユニークID */
  id: string;
  /** フィルター名 */
  name: string;
  /** フィルター条件（year以外） */
  filter: Omit<FilterState, 'year'>;
  /** 作成日時 */
  createdAt: number;
};
