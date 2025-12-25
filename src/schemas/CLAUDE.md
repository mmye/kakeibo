# schemas/ - Zodスキーマ定義

## 責務

Zodを使用したランタイムバリデーションスキーマを定義する。
外部データ（TSVファイル、ユーザー入力）の境界でバリデーションを行う。

## ファイル構成

```
schemas/
├── transaction.ts   # トランザクション関連スキーマ
├── summary.ts       # サマリー関連スキーマ
├── filter.ts        # フィルター関連スキーマ
├── errors.ts        # カスタムエラー型
└── index.ts         # 再エクスポート
```

## 設計原則

### 1. types/ との関係

`types/` が TypeScript の型定義、`schemas/` が Zod のランタイムスキーマ。
両者は対応関係にあるが、スキーマから型を導出する。

```typescript
// schemas/transaction.ts
import { z } from 'zod';

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

// スキーマから型を導出
export type Transaction = z.infer<typeof TransactionSchema>;
```

### 2. 境界でのみバリデーション

内部コードでは型を信頼し、バリデーションは不要。

```typescript
// Good: 境界（データ読み込み時）でバリデーション
const rawData = await fetchTSV();
const transactions = TransactionsSchema.parse(rawData);

// Bad: 内部関数でバリデーション
function calcTotal(transactions: Transaction[]) {
  TransactionsSchema.parse(transactions);  // ← 不要
  return transactions.reduce(...);
}
```

### 3. エラーメッセージ

日本語のエラーメッセージを設定する。

```typescript
export const RawTransactionSchema = z.object({
  日付: z.string().regex(/^\d{4}\/\d{1,2}\/\d{1,2}$/, '日付形式が不正です'),
  '金額（円）': z.string().regex(/^-?\d+$/, '金額は整数である必要があります'),
  // ...
});
```

## スキーマ定義

### 生データスキーマ（TSVパース用）

```typescript
// TSVから読み込んだ生データ
export const RawTransactionSchema = z.object({
  計算対象: z.string(),
  日付: z.string().regex(/^\d{4}\/\d{1,2}\/\d{1,2}$/),
  内容: z.string(),
  '金額（円）': z.string().regex(/^-?\d+$/),
  保有金融機関: z.string(),
  大項目: z.string(),
  中項目: z.string(),
  メモ: z.string().optional().default(''),
  振替: z.string(),
  ID: z.string(),
});
```

### 変換後スキーマ（内部使用）

```typescript
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
```

### フィルタースキーマ

```typescript
export const FilterStateSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  month: z.union([z.number().int().min(1).max(12), z.literal('all')]),
  category: z.union([z.string().min(1), z.literal('all')]),
  institution: z.union([z.string().min(1), z.literal('all')]),
  searchQuery: z.string(),
});
```

## 使用例

```typescript
import { TransactionSchema, FilterStateSchema } from '@/schemas';

// データ読み込み時
function loadData(raw: unknown): Transaction[] {
  return z.array(TransactionSchema).parse(raw);
}

// フィルター更新時
function updateFilter(newFilter: unknown): FilterState {
  return FilterStateSchema.parse(newFilter);
}
```

## テストの書き方

```typescript
import { TransactionSchema, RawTransactionSchema } from './transaction';

describe('TransactionSchema', () => {
  it('有効なデータをパースする', () => {
    const valid = {
      id: 'abc123',
      date: new Date(),
      description: 'テスト',
      amount: -1000,
      institution: 'テスト銀行',
      category: '食費',
      subcategory: '食料品',
      memo: '',
      isTransfer: false,
      isCalculated: true,
    };

    expect(() => TransactionSchema.parse(valid)).not.toThrow();
  });

  it('不正なデータでエラー', () => {
    const invalid = { id: '' };  // 必須フィールド不足
    expect(() => TransactionSchema.parse(invalid)).toThrow();
  });
});
```

## 禁止事項

1. **内部コードでのバリデーション**: 境界でのみ使用
2. **過度なバリデーション**: パフォーマンスに影響
3. **スキーマと型の二重定義**: `z.infer<>` で型を導出
4. **複雑なカスタムバリデーション**: シンプルに保つ

## types/ との使い分け

| 状況 | 使用するもの |
|------|-------------|
| コンポーネントのprops定義 | `types/` の型 |
| フック・関数の引数/戻り値 | `types/` の型 |
| 外部データのバリデーション | `schemas/` のスキーマ |
| ユーザー入力のバリデーション | `schemas/` のスキーマ |
