# utils/ - ユーティリティ関数

## 責務

純粋な計算・変換・フォーマット関数を提供する。
状態を持たず、同じ入力に対して常に同じ出力を返す。

## ディレクトリ構成

```
utils/
├── formatters/      # 表示フォーマット
├── calculations/    # 集計・計算
├── filters/         # フィルタリング
├── validators/      # バリデーション
├── cn.ts            # classname ヘルパー
└── index.ts
```

## 設計原則

### 1. 純粋関数のみ

```typescript
// Good: 純粋関数
export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('ja-JP');
  return value >= 0 ? `+¥${formatted}` : `-¥${formatted}`;
}

// Bad: 副作用がある
let lastValue = 0;
export function formatCurrency(value: number): string {
  lastValue = value;  // ← 副作用
  // ...
}
```

### 2. 単一責任

1つの関数は1つのことだけを行う。

```typescript
// Good: 単一責任
export function formatCurrency(value: number): string { ... }
export function formatPercentage(value: number): string { ... }
export function formatDate(date: Date): string { ... }

// Bad: 複数の責任
export function format(value: unknown, type: 'currency' | 'percent' | 'date') {
  switch (type) { ... }
}
```

### 3. 型安全

```typescript
// Good: 厳密な型
export function calcTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

// Bad: any の使用
export function calcTotal(transactions: any[]): number { ... }
```

## formatters/ - フォーマッター

### currency.ts

金額のフォーマット。

```typescript
/**
 * 金額を日本円形式でフォーマット
 * @example formatCurrency(1234) → "+¥1,234"
 * @example formatCurrency(-5678) → "-¥5,678"
 */
export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('ja-JP');
  if (value > 0) return `+¥${formatted}`;
  if (value < 0) return `-¥${formatted}`;
  return `¥${formatted}`;
}

/**
 * 符号なしの金額フォーマット
 * @example formatAmount(1234) → "¥1,234"
 */
export function formatAmount(value: number): string {
  return `¥${Math.abs(value).toLocaleString('ja-JP')}`;
}
```

### percentage.ts

パーセンテージのフォーマット。

```typescript
/**
 * 変化率をパーセント表示
 * @example formatPercentage(0.052) → "+5.2%"
 * @example formatPercentage(-0.123) → "-12.3%"
 */
export function formatPercentage(value: number): string {
  const percent = (value * 100).toFixed(1);
  if (value > 0) return `+${percent}%`;
  if (value < 0) return `${percent}%`;
  return `${percent}%`;
}

/**
 * 割合をパーセント表示（符号なし）
 * @example formatRatio(0.152) → "15.2%"
 */
export function formatRatio(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
```

### date.ts

日付のフォーマット。

```typescript
/**
 * 日付を "12月25日" 形式でフォーマット
 */
export function formatDate(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 日付を "2025/12/25" 形式でフォーマット
 */
export function formatDateFull(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

/**
 * 月を "12月" 形式でフォーマット
 */
export function formatMonth(month: number): string {
  return `${month}月`;
}

/**
 * 年月を "2025年12月" 形式でフォーマット
 */
export function formatYearMonth(year: number, month: number): string {
  return `${year}年${month}月`;
}
```

## calculations/ - 計算関数

### summary.ts

集計計算。

```typescript
import type { Transaction, MonthlySummary } from '@/types';

/**
 * 合計を計算
 */
export function calcTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

/**
 * 収入合計を計算
 */
export function calcIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * 支出合計を計算（絶対値で返す）
 */
export function calcExpense(transactions: Transaction[]): number {
  return Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );
}

/**
 * 月別サマリーを計算
 */
export function calcMonthlySummary(transactions: Transaction[]): MonthlySummary[] {
  const grouped = groupByMonth(transactions);

  return Object.entries(grouped)
    .map(([month, txs]) => ({
      month,
      income: calcIncome(txs),
      expense: calcExpense(txs),
      balance: calcTotal(txs),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function groupByMonth(transactions: Transaction[]): Record<string, Transaction[]> {
  return transactions.reduce((acc, t) => {
    const month = `${t.date.getMonth() + 1}月`;
    (acc[month] ??= []).push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);
}
```

### comparison.ts

比較・トレンド計算。

```typescript
/**
 * 前月比を計算
 * @returns 変化率 (0.05 = +5%)
 */
export function calcMonthOverMonth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return (current - previous) / Math.abs(previous);
}

/**
 * 成長率を計算
 */
export function calcGrowthRate(values: number[]): number {
  if (values.length < 2) return 0;
  const first = values[0];
  const last = values[values.length - 1];
  if (first === 0) return 0;
  return (last - first) / Math.abs(first);
}
```

### ranking.ts

ランキング計算。

```typescript
import type { Transaction, RankingItem } from '@/types';

/**
 * 中項目別の支出ランキングを計算
 */
export function calcSubcategoryRanking(
  transactions: Transaction[],
  limit: number = 10
): RankingItem[] {
  const expenses = transactions.filter(t => t.amount < 0);
  const totalExpense = Math.abs(calcTotal(expenses));

  const grouped = expenses.reduce((acc, t) => {
    const key = t.subcategory || t.category;
    acc[key] = (acc[key] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([subcategory, amount]) => ({
      subcategory,
      amount,
      percentage: totalExpense > 0 ? amount / totalExpense : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

/**
 * 高額支出を抽出
 */
export function getHighExpenses(
  transactions: Transaction[],
  threshold: number = 10000,
  limit: number = 10
): Transaction[] {
  return transactions
    .filter(t => t.amount < -threshold)
    .sort((a, b) => a.amount - b.amount)  // 金額が小さい（大きな支出）順
    .slice(0, limit);
}
```

## filters/ - フィルター関数

### dateFilter.ts

```typescript
/**
 * 特定月のデータを抽出
 */
export function filterByMonth(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  return transactions.filter(t =>
    t.date.getFullYear() === year && t.date.getMonth() + 1 === month
  );
}

/**
 * 特定年のデータを抽出
 */
export function filterByYear(
  transactions: Transaction[],
  year: number
): Transaction[] {
  return transactions.filter(t => t.date.getFullYear() === year);
}

/**
 * 期間でフィルタ
 */
export function filterByDateRange(
  transactions: Transaction[],
  start: Date,
  end: Date
): Transaction[] {
  return transactions.filter(t => t.date >= start && t.date <= end);
}
```

### categoryFilter.ts

```typescript
/**
 * カテゴリでフィルタ
 */
export function filterByCategory(
  transactions: Transaction[],
  category: string
): Transaction[] {
  return transactions.filter(t => t.category === category);
}

/**
 * 中項目でフィルタ
 */
export function filterBySubcategory(
  transactions: Transaction[],
  subcategory: string
): Transaction[] {
  return transactions.filter(t => t.subcategory === subcategory);
}
```

### index.ts（フィルター統合）

```typescript
import type { Transaction, FilterState } from '@/types';

/**
 * フィルター状態を適用
 */
export function applyFilters(
  transactions: Transaction[],
  filters: FilterState
): Transaction[] {
  let result = transactions;

  // 年
  result = result.filter(t => t.date.getFullYear() === filters.year);

  // 月
  if (filters.month !== 'all') {
    result = result.filter(t => t.date.getMonth() + 1 === filters.month);
  }

  // カテゴリ
  if (filters.category !== 'all') {
    result = result.filter(t => t.category === filters.category);
  }

  // 金融機関
  if (filters.institution !== 'all') {
    result = result.filter(t => t.institution === filters.institution);
  }

  // 検索
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(t =>
      t.description.toLowerCase().includes(query)
    );
  }

  return result;
}
```

## cn.ts - クラス名ヘルパー

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSのクラス名を結合・マージ
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

## テストの書き方

```typescript
import { formatCurrency, formatPercentage } from './formatters';
import { calcTotal, calcMonthlySummary } from './calculations';

describe('formatCurrency', () => {
  it('正の値にプラス記号を付ける', () => {
    expect(formatCurrency(1234)).toBe('+¥1,234');
  });

  it('負の値にマイナス記号を付ける', () => {
    expect(formatCurrency(-5678)).toBe('-¥5,678');
  });

  it('0は符号なし', () => {
    expect(formatCurrency(0)).toBe('¥0');
  });

  it('カンマ区切りになる', () => {
    expect(formatCurrency(1234567)).toBe('+¥1,234,567');
  });
});

describe('calcTotal', () => {
  it('合計を計算する', () => {
    const transactions = [
      { amount: 1000 },
      { amount: -500 },
      { amount: 300 },
    ] as Transaction[];

    expect(calcTotal(transactions)).toBe(800);
  });

  it('空配列は0', () => {
    expect(calcTotal([])).toBe(0);
  });
});
```

## 禁止事項

1. **状態の保持**: 関数内で状態を持たない
2. **副作用**: console.log, fetch, DOM操作等は行わない
3. **UIロジック**: React コンポーネント固有の処理は書かない
4. **過度な抽象化**: シンプルな関数を保つ

## エクスポート

```typescript
// utils/index.ts
export * from './formatters';
export * from './calculations';
export * from './filters';
export { cn } from './cn';
```
