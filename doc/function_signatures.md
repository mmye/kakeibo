# 関数シグネチャ一覧

アプリケーション内の主要な関数・フック・ユーティリティのシグネチャ定義。

---

## Services

### dataLoader.ts

```typescript
/**
 * TSVファイルを読み込む
 * @returns TSV文字列
 * @throws DataLoadError 読み込み失敗時
 */
function loadTSV(): Promise<string>
```

### dataParser.ts

```typescript
/**
 * TSV文字列をパースしてオブジェクト配列に変換
 * @param tsv TSV形式の文字列
 * @returns パース済みの生データ配列
 * @throws DataParseError パース失敗時
 */
function parseTSV(tsv: string): RawTransaction[]
```

### dataTransformer.ts

```typescript
/**
 * 生データ配列をTransaction型配列に変換
 * 変換に失敗したレコードはスキップされる
 * @param raw パース済み生データ配列
 * @returns 変換済みトランザクション配列
 */
function transformTransactions(raw: RawTransaction[]): Transaction[]

/**
 * 単一の生データをTransaction型に変換
 * @param raw 生データ
 * @returns 変換成功時はTransaction、失敗時はnull
 */
function transformTransaction(raw: RawTransaction): Transaction | null

/**
 * 日付文字列をDateオブジェクトに変換
 * @param dateStr "YYYY/MM/DD" 形式の文字列
 * @returns Dateオブジェクト
 * @throws Error 不正な形式の場合
 */
function parseDate(dateStr: string): Date

/**
 * 金額文字列を数値に変換
 * @param amountStr 金額文字列
 * @returns 金額（整数）
 * @throws Error 不正な形式の場合
 */
function parseAmount(amountStr: string): number
```

### index.ts（統合エントリーポイント）

```typescript
/**
 * トランザクションデータを読み込み・パース・変換
 * @returns バリデーション済みトランザクション配列
 * @throws DataLoadError 読み込み失敗時
 * @throws DataParseError パース失敗時
 */
function loadTransactions(): Promise<Transaction[]>
```

---

## Hooks

### useTransactions

```typescript
type UseTransactionsReturn = {
  data: Transaction[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * TransactionContext経由でトランザクションデータを取得
 * @returns データ、ローディング状態、エラー
 */
function useTransactions(): UseTransactionsReturn
```

### useFilteredData

```typescript
type UseFilteredDataReturn = {
  data: Transaction[];
  totalCount: number;
  filteredCount: number;
};

/**
 * フィルター適用済みデータを取得
 * FilterContextの状態に基づいてフィルタリング
 * @returns フィルター適用済みデータと件数
 */
function useFilteredData(): UseFilteredDataReturn
```

### useMonthlySummary

```typescript
/**
 * 月別サマリーを計算
 * @returns 月別サマリー配列（1月〜12月）
 */
function useMonthlySummary(): MonthlySummary[]
```

### useCategorySummary

```typescript
/**
 * カテゴリ別サマリーを計算
 * @returns カテゴリ別サマリー配列（金額降順）
 */
function useCategorySummary(): CategorySummary[]
```

### useInstitutionSummary

```typescript
/**
 * 金融機関別サマリーを計算
 * @returns 金融機関別サマリー配列
 */
function useInstitutionSummary(): InstitutionSummary[]
```

### useRanking

```typescript
/**
 * 中項目別支出ランキングを計算
 * @param limit 取得件数（デフォルト: 10）
 * @returns ランキング配列
 */
function useRanking(limit?: number): RankingItem[]
```

### useTrend

```typescript
/**
 * 前月比トレンドを計算
 * @returns 収入・支出・収支の変化率
 */
function useTrend(): TrendData
```

### useChartData

```typescript
/**
 * データをチャート用に変換
 * @param transformer 変換関数
 * @returns 変換済みチャートデータ
 */
function useChartData<T>(transformer: (data: Transaction[]) => T): T
```

---

## Contexts

### FilterContext

```typescript
type FilterState = {
  year: number;
  month: number | 'all';
  category: string | 'all';
  institution: string | 'all';
  searchQuery: string;
};

type FilterContextValue = {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
};

/**
 * FilterContextの値を取得
 * @returns フィルター状態と更新関数
 * @throws Error Provider外で使用した場合
 */
function useFilterContext(): FilterContextValue
```

### TransactionContext

```typescript
type TransactionContextValue = {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
};

/**
 * TransactionContextの値を取得
 * @returns トランザクションデータと状態
 * @throws Error Provider外で使用した場合
 */
function useTransactionContext(): TransactionContextValue
```

---

## Utils - Formatters

### currency.ts

```typescript
/**
 * 金額を日本円形式でフォーマット（符号付き）
 * @param value 金額
 * @returns フォーマット済み文字列
 * @example formatCurrency(1234) → "+¥1,234"
 * @example formatCurrency(-5678) → "-¥5,678"
 * @example formatCurrency(0) → "¥0"
 */
function formatCurrency(value: number): string

/**
 * 金額を日本円形式でフォーマット（符号なし）
 * @param value 金額
 * @returns フォーマット済み文字列
 * @example formatAmount(1234) → "¥1,234"
 */
function formatAmount(value: number): string
```

### percentage.ts

```typescript
/**
 * 変化率をパーセント表示（符号付き）
 * @param value 変化率（0.052 = 5.2%）
 * @returns フォーマット済み文字列
 * @example formatPercentage(0.052) → "+5.2%"
 * @example formatPercentage(-0.123) → "-12.3%"
 */
function formatPercentage(value: number): string

/**
 * 割合をパーセント表示（符号なし）
 * @param value 割合（0-1）
 * @returns フォーマット済み文字列
 * @example formatRatio(0.152) → "15.2%"
 */
function formatRatio(value: number): string
```

### date.ts

```typescript
/**
 * 日付を "12月25日" 形式でフォーマット
 * @param date 日付
 * @returns フォーマット済み文字列
 */
function formatDate(date: Date): string

/**
 * 日付を "2025/12/25" 形式でフォーマット
 * @param date 日付
 * @returns フォーマット済み文字列
 */
function formatDateFull(date: Date): string

/**
 * 月を "12月" 形式でフォーマット
 * @param month 月（1-12）
 * @returns フォーマット済み文字列
 */
function formatMonth(month: number): string

/**
 * 年月を "2025年12月" 形式でフォーマット
 * @param year 年
 * @param month 月
 * @returns フォーマット済み文字列
 */
function formatYearMonth(year: number, month: number): string
```

---

## Utils - Calculations

### summary.ts

```typescript
/**
 * 合計金額を計算
 * @param transactions トランザクション配列
 * @returns 合計金額
 */
function calcTotal(transactions: Transaction[]): number

/**
 * 収入合計を計算
 * @param transactions トランザクション配列
 * @returns 収入合計（正の値のみ）
 */
function calcIncome(transactions: Transaction[]): number

/**
 * 支出合計を計算
 * @param transactions トランザクション配列
 * @returns 支出合計（絶対値で返す）
 */
function calcExpense(transactions: Transaction[]): number

/**
 * 月別サマリーを計算
 * @param transactions トランザクション配列
 * @returns 月別サマリー配列
 */
function calcMonthlySummary(transactions: Transaction[]): MonthlySummary[]

/**
 * カテゴリ別サマリーを計算
 * @param transactions トランザクション配列
 * @returns カテゴリ別サマリー配列
 */
function calcCategorySummary(transactions: Transaction[]): CategorySummary[]
```

### comparison.ts

```typescript
/**
 * 前月比を計算
 * @param current 今月の値
 * @param previous 先月の値
 * @returns 変化率（0.05 = +5%）
 */
function calcMonthOverMonth(current: number, previous: number): number

/**
 * 成長率を計算
 * @param values 値の配列（時系列順）
 * @returns 成長率
 */
function calcGrowthRate(values: number[]): number

/**
 * トレンドデータを計算
 * @param transactions 全トランザクション
 * @param currentMonth 対象月
 * @returns 収入・支出・収支の変化率
 */
function calcTrend(transactions: Transaction[], currentMonth: number): TrendData
```

### ranking.ts

```typescript
/**
 * 中項目別支出ランキングを計算
 * @param transactions トランザクション配列
 * @param limit 取得件数（デフォルト: 10）
 * @returns ランキング配列
 */
function calcSubcategoryRanking(transactions: Transaction[], limit?: number): RankingItem[]

/**
 * 高額支出を抽出
 * @param transactions トランザクション配列
 * @param threshold 閾値（デフォルト: 10000）
 * @param limit 取得件数（デフォルト: 10）
 * @returns 高額支出のトランザクション配列
 */
function getHighExpenses(
  transactions: Transaction[],
  threshold?: number,
  limit?: number
): Transaction[]
```

---

## Utils - Filters

### dateFilter.ts

```typescript
/**
 * 特定月のデータを抽出
 * @param transactions トランザクション配列
 * @param year 年
 * @param month 月
 * @returns フィルター済み配列
 */
function filterByMonth(transactions: Transaction[], year: number, month: number): Transaction[]

/**
 * 特定年のデータを抽出
 * @param transactions トランザクション配列
 * @param year 年
 * @returns フィルター済み配列
 */
function filterByYear(transactions: Transaction[], year: number): Transaction[]

/**
 * 期間でフィルタ
 * @param transactions トランザクション配列
 * @param start 開始日
 * @param end 終了日
 * @returns フィルター済み配列
 */
function filterByDateRange(transactions: Transaction[], start: Date, end: Date): Transaction[]
```

### categoryFilter.ts

```typescript
/**
 * カテゴリでフィルタ
 * @param transactions トランザクション配列
 * @param category カテゴリ名
 * @returns フィルター済み配列
 */
function filterByCategory(transactions: Transaction[], category: string): Transaction[]

/**
 * 中項目でフィルタ
 * @param transactions トランザクション配列
 * @param subcategory 中項目名
 * @returns フィルター済み配列
 */
function filterBySubcategory(transactions: Transaction[], subcategory: string): Transaction[]
```

### index.ts

```typescript
/**
 * フィルター状態を一括適用
 * @param transactions トランザクション配列
 * @param filters フィルター状態
 * @returns フィルター済み配列
 */
function applyFilters(transactions: Transaction[], filters: FilterState): Transaction[]
```

---

## Utils - Helpers

### cn.ts

```typescript
/**
 * Tailwind CSSのクラス名を結合・マージ
 * clsx + tailwind-merge のラッパー
 * @param inputs クラス名（条件付き含む）
 * @returns マージ済みクラス名
 * @example cn('px-4', isActive && 'bg-primary', 'py-2') → "px-4 bg-primary py-2"
 */
function cn(...inputs: ClassValue[]): string
```

---

## Constants - Helpers

### categories.ts

```typescript
/**
 * カテゴリの色を取得
 * @param category カテゴリ名
 * @returns HEXカラーコード（未定義の場合は「その他」の色）
 */
function getCategoryColor(category: string): string

/**
 * カテゴリのアイコンを取得
 * @param category カテゴリ名
 * @returns Lucide Iconコンポーネント
 */
function getCategoryIcon(category: string): LucideIcon
```

### institutions.ts

```typescript
/**
 * 金融機関の短縮名を取得
 * @param institution 金融機関名
 * @returns 短縮名（未定義の場合は元の名前）
 */
function getInstitutionShortName(institution: string): string
```

---

## Error Types

### errors.ts

```typescript
/**
 * データ読み込みエラー
 */
class DataLoadError extends Error {
  constructor(message: string, cause?: unknown)
  readonly cause?: unknown
}

/**
 * データパースエラー
 */
class DataParseError extends Error {
  constructor(message: string, line?: number)
  readonly line?: number
}

/**
 * バリデーションエラー（Zodエラーのラッパー）
 */
class ValidationError extends Error {
  constructor(message: string, zodError: z.ZodError)
  readonly zodError: z.ZodError
  get issues(): z.ZodIssue[]
}
```

---

## Types

詳細は `src/types/` を参照。

```typescript
// トランザクション
type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  institution: string;
  category: string;
  subcategory: string;
  memo: string;
  isTransfer: boolean;
  isCalculated: boolean;
};

// 月別サマリー
type MonthlySummary = {
  month: string;
  income: number;
  expense: number;
  balance: number;
};

// カテゴリ別サマリー
type CategorySummary = {
  category: string;
  amount: number;
  percentage: number;
  color: string;
};

// 金融機関別サマリー
type InstitutionSummary = {
  institution: string;
  amount: number;
  percentage: number;
};

// ランキング項目
type RankingItem = {
  rank: number;
  subcategory: string;
  category: string;
  amount: number;
  percentage: number;
};

// トレンドデータ
type TrendData = {
  income: number;
  expense: number;
  balance: number;
};

// フィルター状態
type FilterState = {
  year: number;
  month: number | 'all';
  category: string | 'all';
  institution: string | 'all';
  searchQuery: string;
};

// ソート状態
type SortState = {
  column: 'date' | 'amount' | 'category';
  direction: 'asc' | 'desc';
};
```
