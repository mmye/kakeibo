# services/ - データ処理サービス

## 責務

外部データソース（TSVファイル）の読み込みとパース処理を担当。
データの取得・変換・正規化を行う。

## 配置するサービス

| サービス | 責務 |
|---------|------|
| `dataLoader` | TSVファイルのfetch |
| `dataParser` | TSV文字列→オブジェクト配列変換 |
| `dataTransformer` | データの正規化・型変換 |

## 設計原則

### 1. 純粋関数として実装

状態を持たず、入力に対して常に同じ出力を返す。

```typescript
// Good: 純粋関数
export function parseTSV(tsvString: string): RawTransaction[] {
  const lines = tsvString.trim().split('\n');
  const headers = lines[0].split('\t');
  return lines.slice(1).map(line => {
    const values = line.split('\t');
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i];
      return obj;
    }, {} as Record<string, string>);
  });
}

// Bad: 外部状態に依存
let cache: RawTransaction[] = [];
export function parseTSV(tsvString: string) {
  if (cache.length) return cache;  // ← 状態を持ってしまう
  // ...
}
```

### 2. 境界でのバリデーション

データの検証は読み込み時（境界）で行う。内部では型を信頼する。

```typescript
// dataTransformer.ts - 境界でバリデーション
export function transformTransaction(raw: RawTransaction): Transaction | null {
  // 必須フィールドのチェック
  if (!raw['日付'] || !raw['金額（円）']) {
    console.warn('Invalid transaction:', raw);
    return null;
  }

  // 型変換
  const amount = parseInt(raw['金額（円）'], 10);
  if (isNaN(amount)) {
    console.warn('Invalid amount:', raw['金額（円）']);
    return null;
  }

  return {
    id: raw['ID'],
    date: parseDate(raw['日付']),
    description: raw['内容'],
    amount,
    institution: raw['保有金融機関'],
    category: raw['大項目'],
    subcategory: raw['中項目'],
    memo: raw['メモ'] || '',
    isTransfer: raw['振替'] === '1',
    isCalculated: raw['計算対象'] === '1',
  };
}

// 内部コード - 型を信頼
function calcTotal(transactions: Transaction[]): number {
  // amount が number であることは保証されている
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}
```

### 3. エラーハンドリング

```typescript
// カスタムエラー型
export class DataLoadError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DataLoadError';
  }
}

export class DataParseError extends Error {
  constructor(message: string, public readonly line?: number) {
    super(message);
    this.name = 'DataParseError';
  }
}

// 使用
export async function loadTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch('/data/data.tsv');
    if (!response.ok) {
      throw new DataLoadError(`HTTP ${response.status}`);
    }
    const text = await response.text();
    return parseAndTransform(text);
  } catch (e) {
    if (e instanceof DataLoadError) throw e;
    throw new DataLoadError('Failed to load data', e);
  }
}
```

## 個別サービス仕様

### dataLoader

TSVファイルを読み込む。

```typescript
// dataLoader.ts
const DATA_PATH = '/data/data.tsv';

export async function loadTSV(): Promise<string> {
  const response = await fetch(DATA_PATH);
  if (!response.ok) {
    throw new DataLoadError(`Failed to fetch: ${response.status}`);
  }
  return response.text();
}
```

### dataParser

TSV文字列をパースする。

```typescript
// dataParser.ts
type RawTransaction = Record<string, string>;

export function parseTSV(tsv: string): RawTransaction[] {
  const lines = tsv.trim().split('\n');
  if (lines.length < 2) {
    throw new DataParseError('TSV must have header and at least one data row');
  }

  const headers = lines[0].split('\t');

  return lines.slice(1).map((line, index) => {
    const values = line.split('\t');
    if (values.length !== headers.length) {
      throw new DataParseError(
        `Column count mismatch at line ${index + 2}`,
        index + 2
      );
    }
    return Object.fromEntries(
      headers.map((h, i) => [h, values[i]])
    );
  });
}
```

### dataTransformer

生データを型付きオブジェクトに変換。

```typescript
// dataTransformer.ts
import type { Transaction } from '@/types';

export function transformTransactions(raw: RawTransaction[]): Transaction[] {
  return raw
    .map(transformTransaction)
    .filter((t): t is Transaction => t !== null);
}

function transformTransaction(raw: RawTransaction): Transaction | null {
  try {
    return {
      id: raw['ID'] || generateId(),
      date: parseDate(raw['日付']),
      description: raw['内容'] || '',
      amount: parseAmount(raw['金額（円）']),
      institution: raw['保有金融機関'] || '',
      category: raw['大項目'] || 'その他',
      subcategory: raw['中項目'] || '',
      memo: raw['メモ'] || '',
      isTransfer: raw['振替'] === '1',
      isCalculated: raw['計算対象'] === '1',
    };
  } catch {
    return null;  // 変換失敗は除外
  }
}

function parseDate(dateStr: string): Date {
  // "2025/12/25" → Date
  const [year, month, day] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function parseAmount(amountStr: string): number {
  const amount = parseInt(amountStr, 10);
  if (isNaN(amount)) {
    throw new Error(`Invalid amount: ${amountStr}`);
  }
  return amount;
}
```

### 統合関数

```typescript
// index.ts
export async function loadTransactions(): Promise<Transaction[]> {
  const tsv = await loadTSV();
  const raw = parseTSV(tsv);
  return transformTransactions(raw);
}
```

## テストの書き方

```typescript
import { parseTSV } from './dataParser';
import { transformTransactions } from './dataTransformer';

describe('parseTSV', () => {
  it('TSVをパースする', () => {
    const tsv = '名前\t年齢\n太郎\t30\n花子\t25';
    const result = parseTSV(tsv);

    expect(result).toEqual([
      { '名前': '太郎', '年齢': '30' },
      { '名前': '花子', '年齢': '25' },
    ]);
  });

  it('空のTSVでエラー', () => {
    expect(() => parseTSV('')).toThrow(DataParseError);
  });

  it('カラム数不一致でエラー', () => {
    const tsv = 'a\tb\n1\t2\t3';  // ヘッダー2列、データ3列
    expect(() => parseTSV(tsv)).toThrow('Column count mismatch');
  });
});

describe('transformTransactions', () => {
  it('生データをTransaction型に変換する', () => {
    const raw = [{
      'ID': 'abc123',
      '日付': '2025/12/25',
      '内容': 'テスト',
      '金額（円）': '-1000',
      '保有金融機関': 'テスト銀行',
      '大項目': '食費',
      '中項目': '食料品',
      'メモ': '',
      '振替': '0',
      '計算対象': '1',
    }];

    const result = transformTransactions(raw);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'abc123',
      amount: -1000,
      category: '食費',
      isCalculated: true,
    });
    expect(result[0].date).toBeInstanceOf(Date);
  });

  it('不正なデータはスキップする', () => {
    const raw = [
      { '日付': '2025/12/25', '金額（円）': '1000' },  // 正常
      { '日付': 'invalid', '金額（円）': '1000' },     // 日付不正
      { '日付': '2025/12/25', '金額（円）': 'abc' },   // 金額不正
    ];

    const result = transformTransactions(raw);
    expect(result).toHaveLength(1);
  });
});
```

## 禁止事項

1. **状態の保持**: キャッシュ等は hooks や Context で行う
2. **UIロジック**: 表示フォーマットは utils/formatters で行う
3. **ビジネスロジック**: 集計・計算は utils/calculations で行う
4. **過剰なバリデーション**: 境界でのみ検証、内部は型を信頼

## ファイル構成

```
services/
├── dataLoader.ts      # ファイル読み込み
├── dataParser.ts      # TSVパース
├── dataTransformer.ts # データ変換
├── errors.ts          # カスタムエラー
├── index.ts           # 統合エクスポート
└── CLAUDE.md
```

```typescript
// index.ts
export { loadTSV } from './dataLoader';
export { parseTSV } from './dataParser';
export { transformTransactions } from './dataTransformer';
export { DataLoadError, DataParseError } from './errors';

// メインのエントリーポイント
export async function loadTransactions(): Promise<Transaction[]> {
  const tsv = await loadTSV();
  const raw = parseTSV(tsv);
  return transformTransactions(raw);
}
```
