# API仕様書

## 概要

本アプリケーションはフロントエンドのみで構成され、TSVファイルからデータを読み込む。
データの境界（外部入力）でZodによるバリデーションを行い、型安全性を確保する。

---

## データスキーマ（Zod定義）

### インストール

```bash
npm install zod
```

### スキーマ定義

```typescript
// src/schemas/transaction.ts
import { z } from 'zod';

/**
 * TSVから読み込んだ生データのスキーマ
 */
export const RawTransactionSchema = z.object({
  計算対象: z.string(),
  日付: z.string().regex(/^\d{4}\/\d{1,2}\/\d{1,2}$/, '日付形式が不正です'),
  内容: z.string(),
  '金額（円）': z.string().regex(/^-?\d+$/, '金額は整数である必要があります'),
  保有金融機関: z.string(),
  大項目: z.string(),
  中項目: z.string(),
  メモ: z.string().optional().default(''),
  振替: z.string(),
  ID: z.string(),
});

export type RawTransaction = z.infer<typeof RawTransactionSchema>;

/**
 * 変換後のトランザクションスキーマ
 */
export const TransactionSchema = z.object({
  id: z.string().min(1),
  date: z.date(),
  description: z.string(),
  amount: z.number().int(),
  institution: z.string(),
  category: z.string(),
  subcategory: z.string(),
  memo: z.string(),
  isTransfer: z.boolean(),
  isCalculated: z.boolean(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

/**
 * トランザクション配列のスキーマ
 */
export const TransactionsSchema = z.array(TransactionSchema);
```

### サマリースキーマ

```typescript
// src/schemas/summary.ts
import { z } from 'zod';

/**
 * 月別サマリー
 */
export const MonthlySummarySchema = z.object({
  month: z.string(),
  income: z.number().nonnegative(),
  expense: z.number().nonnegative(),
  balance: z.number(),
});

export type MonthlySummary = z.infer<typeof MonthlySummarySchema>;

/**
 * カテゴリ別サマリー
 */
export const CategorySummarySchema = z.object({
  category: z.string(),
  amount: z.number().nonnegative(),
  percentage: z.number().min(0).max(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export type CategorySummary = z.infer<typeof CategorySummarySchema>;

/**
 * ランキング項目
 */
export const RankingItemSchema = z.object({
  rank: z.number().int().positive(),
  subcategory: z.string(),
  category: z.string(),
  amount: z.number().nonnegative(),
  percentage: z.number().min(0).max(1),
});

export type RankingItem = z.infer<typeof RankingItemSchema>;

/**
 * トレンドデータ
 */
export const TrendDataSchema = z.object({
  income: z.number(),   // 変化率（-1 ~ ∞）
  expense: z.number(),
  balance: z.number(),
});

export type TrendData = z.infer<typeof TrendDataSchema>;
```

### フィルタースキーマ

```typescript
// src/schemas/filter.ts
import { z } from 'zod';

/**
 * フィルター状態
 */
export const FilterStateSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  month: z.union([z.number().int().min(1).max(12), z.literal('all')]),
  category: z.union([z.string().min(1), z.literal('all')]),
  institution: z.union([z.string().min(1), z.literal('all')]),
  searchQuery: z.string(),
});

export type FilterState = z.infer<typeof FilterStateSchema>;

/**
 * ソート状態
 */
export const SortStateSchema = z.object({
  column: z.enum(['date', 'amount', 'category']),
  direction: z.enum(['asc', 'desc']),
});

export type SortState = z.infer<typeof SortStateSchema>;

/**
 * ページネーション状態
 */
export const PaginationStateSchema = z.object({
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive().max(100),
});

export type PaginationState = z.infer<typeof PaginationStateSchema>;
```

---

## Services API

### loadTransactions

TSVファイルからトランザクションデータを読み込む。

```typescript
// src/services/index.ts

/**
 * トランザクションデータを読み込み・パース・バリデーション
 *
 * @returns Promise<Transaction[]> バリデーション済みトランザクション配列
 * @throws DataLoadError ファイル読み込み失敗時
 * @throws ZodError バリデーション失敗時
 */
async function loadTransactions(): Promise<Transaction[]>
```

**処理フロー:**

```
1. fetch('/data/data.tsv')
   ↓
2. TSV文字列をパース → RawTransaction[]
   ↓
3. RawTransactionSchema でバリデーション
   ↓
4. Transaction型に変換
   ↓
5. TransactionSchema でバリデーション
   ↓
6. Transaction[] を返却
```

**エラーハンドリング:**

```typescript
import { z } from 'zod';

try {
  const transactions = await loadTransactions();
} catch (e) {
  if (e instanceof z.ZodError) {
    // バリデーションエラー
    console.error('Validation failed:', e.errors);
  } else if (e instanceof DataLoadError) {
    // 読み込みエラー
    console.error('Load failed:', e.message);
  }
}
```

### parseAndValidateTSV

TSV文字列をパース・バリデーション。

```typescript
/**
 * TSV文字列をパースしてバリデーション
 *
 * @param tsv TSV形式の文字列
 * @returns RawTransaction[] バリデーション済み生データ配列
 * @throws ZodError バリデーション失敗時
 */
function parseAndValidateTSV(tsv: string): RawTransaction[]
```

**実装例:**

```typescript
import { z } from 'zod';
import { RawTransactionSchema } from '@/schemas';

export function parseAndValidateTSV(tsv: string): RawTransaction[] {
  const lines = tsv.trim().split('\n');
  const headers = lines[0].split('\t');

  const rawData = lines.slice(1).map((line, index) => {
    const values = line.split('\t');
    const obj = Object.fromEntries(
      headers.map((h, i) => [h, values[i] ?? ''])
    );

    // 各行をバリデーション
    const result = RawTransactionSchema.safeParse(obj);
    if (!result.success) {
      console.warn(`Row ${index + 2} validation failed:`, result.error.errors);
      return null;
    }
    return result.data;
  });

  return rawData.filter((row): row is RawTransaction => row !== null);
}
```

### transformTransaction

生データをTransaction型に変換。

```typescript
/**
 * 生データをTransaction型に変換・バリデーション
 *
 * @param raw バリデーション済み生データ
 * @returns Transaction | null 変換失敗時はnull
 */
function transformTransaction(raw: RawTransaction): Transaction | null
```

**実装例:**

```typescript
import { TransactionSchema } from '@/schemas';

export function transformTransaction(raw: RawTransaction): Transaction | null {
  try {
    const transaction = {
      id: raw.ID,
      date: parseDate(raw.日付),
      description: raw.内容,
      amount: parseInt(raw['金額（円）'], 10),
      institution: raw.保有金融機関,
      category: raw.大項目,
      subcategory: raw.中項目,
      memo: raw.メモ ?? '',
      isTransfer: raw.振替 === '1',
      isCalculated: raw.計算対象 === '1',
    };

    // 最終バリデーション
    return TransactionSchema.parse(transaction);
  } catch {
    return null;
  }
}
```

---

## Hooks API

### useTransactions

トランザクションデータを取得・管理。

```typescript
/**
 * トランザクションデータを取得
 *
 * @returns {
 *   data: Transaction[]      // トランザクション配列
 *   isLoading: boolean       // 読み込み中フラグ
 *   error: Error | null      // エラー（あれば）
 *   reload: () => void       // 再読み込み関数
 * }
 */
function useTransactions(): UseTransactionsReturn
```

**戻り値の型:**

```typescript
type UseTransactionsReturn = {
  data: Transaction[];
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
};
```

### useFilteredData

フィルター適用済みデータを取得。

```typescript
/**
 * フィルター適用済みデータを取得
 *
 * @returns {
 *   data: Transaction[]      // フィルター適用済みデータ
 *   totalCount: number       // フィルター前の件数
 *   filteredCount: number    // フィルター後の件数
 * }
 */
function useFilteredData(): UseFilteredDataReturn
```

**入力（FilterContextから取得）:**

```typescript
// FilterStateSchema に準拠
{
  year: 2025,
  month: 12,           // または 'all'
  category: '食費',    // または 'all'
  institution: 'all',
  searchQuery: '',
}
```

### useMonthlySummary

月別サマリーを計算。

```typescript
/**
 * 月別サマリーを計算
 *
 * @returns MonthlySummary[] 月別サマリー配列（1月〜12月）
 */
function useMonthlySummary(): MonthlySummary[]
```

**出力例:**

```typescript
[
  { month: '1月', income: 520000, expense: 380000, balance: 140000 },
  { month: '2月', income: 485000, expense: 320000, balance: 165000 },
  // ...
]
```

### useCategorySummary

カテゴリ別サマリーを計算。

```typescript
/**
 * カテゴリ別サマリーを計算
 *
 * @returns CategorySummary[] カテゴリ別サマリー（金額降順）
 */
function useCategorySummary(): CategorySummary[]
```

**出力例:**

```typescript
[
  { category: '食費', amount: 85000, percentage: 0.28, color: '#F59E0B' },
  { category: '教養・教育', amount: 165600, percentage: 0.55, color: '#10B981' },
  // ...
]
```

### useRanking

支出ランキングを計算。

```typescript
/**
 * 中項目別支出ランキングを計算
 *
 * @param limit 取得件数（デフォルト: 10）
 * @returns RankingItem[] ランキング配列
 */
function useRanking(limit?: number): RankingItem[]
```

**出力例:**

```typescript
[
  { rank: 1, subcategory: '保育園', category: '教養・教育', amount: 165600, percentage: 0.55 },
  { rank: 2, subcategory: '食料品', category: '食費', amount: 45000, percentage: 0.15 },
  // ...
]
```

### useTrend

前月比トレンドを計算。

```typescript
/**
 * 前月比を計算
 *
 * @returns TrendData 収入・支出・収支の変化率
 */
function useTrend(): TrendData
```

**出力例:**

```typescript
{
  income: 0.052,    // +5.2%
  expense: -0.08,   // -8.0%
  balance: 0.15,    // +15.0%
}
```

---

## Context API

### FilterContext

フィルター状態を管理。

```typescript
/**
 * フィルターコンテキストの値
 */
type FilterContextValue = {
  /** 現在のフィルター状態 */
  filters: FilterState;

  /** フィルター状態を更新 */
  setFilters: (filters: FilterState) => void;

  /** フィルターをリセット */
  resetFilters: () => void;

  /** 単一フィールドを更新 */
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
};
```

**使用例:**

```typescript
const { filters, updateFilter, resetFilters } = useFilterContext();

// 月を変更
updateFilter('month', 12);

// カテゴリを変更
updateFilter('category', '食費');

// リセット
resetFilters();
```

**バリデーション:**

```typescript
// setFilters 内でバリデーション
const setFilters = (newFilters: FilterState) => {
  const validated = FilterStateSchema.parse(newFilters);
  _setFilters(validated);
};
```

### TransactionContext

トランザクションデータを管理。

```typescript
/**
 * トランザクションコンテキストの値
 */
type TransactionContextValue = {
  /** トランザクション配列 */
  transactions: Transaction[];

  /** 読み込み中フラグ */
  isLoading: boolean;

  /** エラー */
  error: Error | null;

  /** 再読み込み */
  reload: () => Promise<void>;
};
```

---

## Utils API

### formatters

```typescript
/**
 * 金額をフォーマット
 * @param value 金額
 * @returns フォーマット済み文字列
 * @example formatCurrency(1234) → "+¥1,234"
 * @example formatCurrency(-5678) → "-¥5,678"
 */
function formatCurrency(value: number): string

/**
 * パーセンテージをフォーマット
 * @param value 変化率（0.05 = 5%）
 * @returns フォーマット済み文字列
 * @example formatPercentage(0.052) → "+5.2%"
 */
function formatPercentage(value: number): string

/**
 * 日付をフォーマット
 * @param date 日付
 * @returns フォーマット済み文字列
 * @example formatDate(new Date(2025, 11, 25)) → "12月25日"
 */
function formatDate(date: Date): string
```

### calculations

```typescript
/**
 * 合計を計算
 * @param transactions トランザクション配列
 * @returns 合計金額
 */
function calcTotal(transactions: Transaction[]): number

/**
 * 収入合計を計算
 * @param transactions トランザクション配列
 * @returns 収入合計
 */
function calcIncome(transactions: Transaction[]): number

/**
 * 支出合計を計算（正の値で返す）
 * @param transactions トランザクション配列
 * @returns 支出合計
 */
function calcExpense(transactions: Transaction[]): number

/**
 * 月別サマリーを計算
 * @param transactions トランザクション配列
 * @returns 月別サマリー配列
 */
function calcMonthlySummary(transactions: Transaction[]): MonthlySummary[]

/**
 * 前月比を計算
 * @param current 今月の値
 * @param previous 先月の値
 * @returns 変化率
 */
function calcMonthOverMonth(current: number, previous: number): number
```

### filters

```typescript
/**
 * フィルターを適用
 * @param transactions トランザクション配列
 * @param filters フィルター状態
 * @returns フィルター適用済み配列
 */
function applyFilters(
  transactions: Transaction[],
  filters: FilterState
): Transaction[]
```

---

## エラー型

```typescript
// src/schemas/errors.ts
import { z } from 'zod';

/**
 * データ読み込みエラー
 */
export class DataLoadError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DataLoadError';
  }
}

/**
 * バリデーションエラーのラッパー
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly zodError: z.ZodError
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  get issues() {
    return this.zodError.issues;
  }
}
```

---

## スキーマファイル構成

```
src/schemas/
├── transaction.ts   # トランザクション関連スキーマ
├── summary.ts       # サマリー関連スキーマ
├── filter.ts        # フィルター関連スキーマ
├── errors.ts        # エラー型
└── index.ts         # 再エクスポート
```

```typescript
// src/schemas/index.ts
export {
  RawTransactionSchema,
  TransactionSchema,
  TransactionsSchema,
} from './transaction';
export type { RawTransaction, Transaction } from './transaction';

export {
  MonthlySummarySchema,
  CategorySummarySchema,
  RankingItemSchema,
  TrendDataSchema,
} from './summary';
export type {
  MonthlySummary,
  CategorySummary,
  RankingItem,
  TrendData,
} from './summary';

export {
  FilterStateSchema,
  SortStateSchema,
  PaginationStateSchema,
} from './filter';
export type { FilterState, SortState, PaginationState } from './filter';

export { DataLoadError, ValidationError } from './errors';
```

---

## バリデーション戦略

### 境界でのみバリデーション

```
外部データ（TSV）
    ↓ ← ここでZodバリデーション
内部処理（型を信頼）
    ↓
UI表示
```

### バリデーションタイミング

| タイミング | バリデーション | 理由 |
|-----------|---------------|------|
| TSV読み込み時 | **する** | 外部データは信頼できない |
| フィルター変更時 | **する** | ユーザー入力は検証必要 |
| hooks間のデータ受け渡し | しない | 内部データは型で保証 |
| コンポーネントへのprops | しない | TypeScriptで保証 |

### 開発時のみのバリデーション

```typescript
// 本番では無効化してパフォーマンス向上
const VALIDATE_INTERNAL = process.env.NODE_ENV === 'development';

function useMonthlySummary(): MonthlySummary[] {
  const { data } = useFilteredData();
  const summary = useMemo(() => calcMonthlySummary(data), [data]);

  if (VALIDATE_INTERNAL) {
    // 開発時のみバリデーション
    z.array(MonthlySummarySchema).parse(summary);
  }

  return summary;
}
```
