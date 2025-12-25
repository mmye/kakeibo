# types/ - 型定義

## 責務

アプリケーション全体で使用する TypeScript 型を定義する。
型の一元管理により、一貫性と保守性を確保する。

## ファイル構成

```
types/
├── transaction.ts   # 取引データ型
├── summary.ts       # サマリー・集計型
├── chart.ts         # チャートデータ型
├── filter.ts        # フィルター型
└── index.ts         # 再エクスポート
```

## 設計原則

### 1. interface より type を優先

このプロジェクトでは `type` を標準とする（一貫性のため）。

```typescript
// Good: type を使用
type Transaction = {
  id: string;
  amount: number;
};

// 継承が必要な場合は intersection
type IncomeTransaction = Transaction & {
  source: string;
};
```

### 2. 明示的な型定義

推論に頼りすぎず、重要な型は明示的に定義する。

```typescript
// Good: 明示的
type MonthlySummary = {
  month: string;
  income: number;
  expense: number;
  balance: number;
};

// Bad: 推論に依存（意図が不明確）
const createSummary = (month: string, income: number, expense: number) => ({
  month,
  income,
  expense,
  balance: income - expense,
});
type MonthlySummary = ReturnType<typeof createSummary>;
```

### 3. Union 型の活用

リテラル型の Union で選択肢を制限する。

```typescript
// Good: Union 型
type AmountSize = 'sm' | 'md' | 'lg';
type FilterMonth = number | 'all';

// Bad: 広すぎる型
type AmountSize = string;
```

### 4. オプショナルは慎重に

本当にオプショナルな場合のみ `?` を使う。

```typescript
// Good: 必須フィールドは必須に
type Transaction = {
  id: string;           // 必須
  amount: number;       // 必須
  memo: string;         // 空文字でも必須
};

// Bad: 何でもオプショナル
type Transaction = {
  id?: string;
  amount?: number;
  memo?: string;
};
```

## 型定義

### transaction.ts

```typescript
/**
 * 取引データの型
 * TSVファイルから読み込んだデータを表現
 */
export type Transaction = {
  /** ユニークID */
  id: string;

  /** 取引日 */
  date: Date;

  /** 取引内容・説明 */
  description: string;

  /** 金額（正:収入、負:支出） */
  amount: number;

  /** 金融機関名 */
  institution: string;

  /** 大項目（カテゴリ） */
  category: string;

  /** 中項目（サブカテゴリ） */
  subcategory: string;

  /** メモ */
  memo: string;

  /** 振替フラグ */
  isTransfer: boolean;

  /** 計算対象フラグ */
  isCalculated: boolean;
};

/**
 * 取引の種別
 */
export type TransactionType = 'income' | 'expense';

/**
 * 取引の種別を判定
 */
export function getTransactionType(amount: number): TransactionType {
  return amount >= 0 ? 'income' : 'expense';
}
```

### summary.ts

```typescript
/**
 * 月別サマリー
 */
export type MonthlySummary = {
  /** 月 ("1月", "2月", ...) */
  month: string;

  /** 収入合計 */
  income: number;

  /** 支出合計（正の値） */
  expense: number;

  /** 収支（income - expense） */
  balance: number;
};

/**
 * カテゴリ別サマリー
 */
export type CategorySummary = {
  /** カテゴリ名 */
  category: string;

  /** 金額（絶対値） */
  amount: number;

  /** 全体に対する割合 (0-1) */
  percentage: number;

  /** チャート表示用の色 */
  color: string;
};

/**
 * 金融機関別サマリー
 */
export type InstitutionSummary = {
  /** 金融機関名 */
  institution: string;

  /** 支出合計 */
  amount: number;

  /** 全体に対する割合 */
  percentage: number;
};

/**
 * ランキング項目
 */
export type RankingItem = {
  /** 順位 */
  rank: number;

  /** 中項目名 */
  subcategory: string;

  /** 親カテゴリ名 */
  category: string;

  /** 金額 */
  amount: number;

  /** 全体に対する割合 */
  percentage: number;
};

/**
 * トレンドデータ（前月比）
 */
export type TrendData = {
  /** 収入の変化率 */
  income: number;

  /** 支出の変化率 */
  expense: number;

  /** 収支の変化率 */
  balance: number;
};
```

### chart.ts

```typescript
/**
 * 月別推移チャート用データ
 */
export type MonthlyTrendData = {
  month: string;
  income: number;
  expense: number;
  balance: number;
};

/**
 * 円グラフ用データ
 */
export type PieChartData = {
  name: string;
  value: number;
  color: string;
};

/**
 * 棒グラフ用データ
 */
export type BarChartData = {
  label: string;
  value: number;
  color?: string;
};

/**
 * ヒートマップ用データ
 */
export type HeatmapData = {
  month: string;
  category: string;
  value: number;
  intensity: number;  // 0-1 の正規化値
};
```

### filter.ts

```typescript
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
```

### index.ts

```typescript
// 再エクスポート
export type {
  Transaction,
  TransactionType,
} from './transaction';

export type {
  MonthlySummary,
  CategorySummary,
  InstitutionSummary,
  RankingItem,
  TrendData,
} from './summary';

export type {
  MonthlyTrendData,
  PieChartData,
  BarChartData,
  HeatmapData,
} from './chart';

export type {
  FilterState,
  SortDirection,
  SortableColumn,
  SortState,
} from './filter';

export { defaultFilterState } from './filter';
export { getTransactionType } from './transaction';
```

## ユーティリティ型

必要に応じてユーティリティ型を定義。

```typescript
// types/utils.ts

/**
 * オブジェクトのキーを取得
 */
export type Keys<T> = keyof T;

/**
 * オブジェクトの値を取得
 */
export type Values<T> = T[keyof T];

/**
 * 一部のプロパティを必須に
 */
export type RequiredPick<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * null/undefined を除外
 */
export type NonNullableProps<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
```

## 禁止事項

1. **any の使用**: unknown を使うか、適切な型を定義する
2. **過度なジェネリクス**: シンプルに保つ
3. **型と実装の混在**: 型定義のみ、ロジックは書かない（型ガード関数は例外）
4. **循環参照**: 型間の循環参照を避ける

## 型ガード

型を絞り込むためのガード関数は types/ に配置してよい。

```typescript
// transaction.ts
export function isIncome(transaction: Transaction): boolean {
  return transaction.amount > 0;
}

export function isExpense(transaction: Transaction): boolean {
  return transaction.amount < 0;
}

export function isCalculated(transaction: Transaction): boolean {
  return transaction.isCalculated && !transaction.isTransfer;
}
```

## 使用例

```typescript
import type { Transaction, MonthlySummary, FilterState } from '@/types';
import { defaultFilterState, getTransactionType } from '@/types';

function processData(transactions: Transaction[]): MonthlySummary[] {
  // ...
}

const filter: FilterState = {
  ...defaultFilterState,
  month: 12,
};
```
