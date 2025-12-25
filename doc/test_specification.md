# テスト仕様書

本ドキュメントでは、家計簿ダッシュボードアプリケーションのテスト戦略、テストパターン、および具体的なテストケースを定義する。

---

## テスト環境

### 使用ツール

| ツール | 用途 |
|--------|------|
| Vitest | テストランナー |
| React Testing Library | コンポーネントテスト |
| @testing-library/jest-dom | DOM マッチャー拡張 |
| @testing-library/user-event | ユーザーインタラクションシミュレーション |
| @vitest/coverage-v8 | カバレッジ計測 |

### 設定ファイル

```
vite.config.ts      # テスト設定（test セクション）
tests/setup.ts      # グローバルセットアップ
```

### テストコマンド

```bash
npm run test           # ウォッチモードでテスト実行
npm run test:ui        # Vitest UI でテスト実行
npm run test:coverage  # カバレッジ付きテスト実行
```

---

## TDD 原則（t-wada 流）

### Red-Green-Refactor サイクル

```
1. Red:     失敗するテストを1つ書く
2. Green:   テストを通す最短のコードを書く
3. Refactor: テストが通る状態を保ちながらリファクタリング
```

### 基本姿勢

| 原則 | 説明 |
|------|------|
| 小さく始める | 最も単純なケースから書き始める |
| 一度に1つ | 複数の機能を同時にテストしない |
| 意図を明確に | テスト名は何をテストしているか明確にする（日本語可） |
| AAA パターン | Arrange-Act-Assert で構造を統一 |
| 仮実装→三角測量→明白な実装 | 段階的に本実装へ進める |

### 仮実装→三角測量→明白な実装

```typescript
// 1. 仮実装（Red → Green を最速で）
function add(a: number, b: number): number {
  return 3; // とりあえず通す
}
test('1 + 2 = 3', () => {
  expect(add(1, 2)).toBe(3);
});

// 2. 三角測量（別のケースで仮実装を崩す）
test('2 + 3 = 5', () => {
  expect(add(2, 3)).toBe(5); // 仮実装では失敗
});

// 3. 明白な実装（正しい実装に置き換え）
function add(a: number, b: number): number {
  return a + b;
}
```

---

## テストファイル構造

### 配置ルール

テストファイルはテスト対象と同じディレクトリに配置（コロケーション）。

```
src/components/ui/Button/
├── Button.tsx
├── Button.test.tsx  ← 同階層に配置
└── index.ts

src/utils/formatters/
├── currency.ts
├── currency.test.ts  ← 同階層に配置
└── index.ts
```

### 命名規則

| 対象 | パターン | 例 |
|------|----------|-----|
| コンポーネント | `{Component}.test.tsx` | `Button.test.tsx` |
| 関数・ユーティリティ | `{module}.test.ts` | `currency.test.ts` |
| フック | `{hook}.test.ts` | `useTransactions.test.ts` |

### テストファイルの構造

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ComponentName } from './ComponentName';

// 必要に応じてモックを設定
vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: vi.fn(),
}));

describe('ComponentName', () => {
  // 共通のセットアップがあれば beforeEach で
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('デフォルト状態で正しくレンダリングされる', () => {
      // Arrange
      const props = { value: 100 };

      // Act
      render(<ComponentName {...props} />);

      // Assert
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('異常系', () => {
    it('値がない場合はフォールバック表示', () => {
      // ...
    });
  });
});
```

---

## 層別テストパターン

### 1. UIコンポーネント（components/）

#### テスト観点

- レンダリング結果の検証
- Props による表示変化
- ユーザーインタラクション
- アクセシビリティ

#### 例: Amount コンポーネント

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Amount } from './Amount';

describe('Amount', () => {
  describe('表示形式', () => {
    it('正の金額を円記号付きで表示する', () => {
      render(<Amount value={1234} />);
      expect(screen.getByText('+¥1,234')).toBeInTheDocument();
    });

    it('負の金額を円記号付きで表示する', () => {
      render(<Amount value={-5678} />);
      expect(screen.getByText('-¥5,678')).toBeInTheDocument();
    });

    it('ゼロを符号なしで表示する', () => {
      render(<Amount value={0} />);
      expect(screen.getByText('¥0')).toBeInTheDocument();
    });
  });

  describe('色分け', () => {
    it('正の金額を収入色（緑）で表示する', () => {
      render(<Amount value={1000} />);
      expect(screen.getByText('+¥1,000')).toHaveClass('text-income');
    });

    it('負の金額を支出色（赤）で表示する', () => {
      render(<Amount value={-1000} />);
      expect(screen.getByText('-¥1,000')).toHaveClass('text-expense');
    });
  });

  describe('サイズバリエーション', () => {
    it('sm サイズで小さいフォントを適用する', () => {
      render(<Amount value={100} size="sm" />);
      expect(screen.getByText('+¥100')).toHaveClass('text-sm');
    });

    it('lg サイズで大きいフォントを適用する', () => {
      render(<Amount value={100} size="lg" />);
      expect(screen.getByText('+¥100')).toHaveClass('text-2xl');
    });
  });
});
```

#### 例: Button コンポーネント

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('クリックでハンドラーが呼ばれる', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 時はクリックできない', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick} disabled>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 2. カスタムフック（hooks/）

#### テストパターン

フックは `renderHook` を使用してテスト。Context 依存のフックはプロバイダーでラップ。

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTransactions } from './useTransactions';
import { TransactionProvider } from '@/contexts/TransactionContext';

// Context プロバイダーのラッパー
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TransactionProvider>{children}</TransactionProvider>
);

describe('useTransactions', () => {
  it('初期状態はローディング中', () => {
    const { result } = renderHook(() => useTransactions(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it('データ読み込み完了後にトランザクション一覧を返す', async () => {
    const { result } = renderHook(() => useTransactions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data.length).toBeGreaterThan(0);
  });
});
```

#### 例: useFilteredData

```typescript
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFilteredData } from './useFilteredData';
import { FilterProvider } from '@/contexts/FilterContext';
import { TransactionProvider } from '@/contexts/TransactionContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TransactionProvider>
    <FilterProvider>{children}</FilterProvider>
  </TransactionProvider>
);

describe('useFilteredData', () => {
  it('フィルター適用前は全データを返す', async () => {
    const { result } = renderHook(() => useFilteredData(), { wrapper });

    await waitFor(() => {
      expect(result.current.totalCount).toBe(result.current.filteredCount);
    });
  });
});
```

### 3. ユーティリティ関数（utils/）

#### テストパターン

純粋関数なので入力と出力のみをテスト。境界値を重視。

#### 例: formatCurrency

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatAmount } from './currency';

describe('formatCurrency', () => {
  describe('正の値', () => {
    it('符号と円記号を付ける', () => {
      expect(formatCurrency(1234)).toBe('+¥1,234');
    });

    it('3桁区切りカンマを入れる', () => {
      expect(formatCurrency(1234567)).toBe('+¥1,234,567');
    });
  });

  describe('負の値', () => {
    it('マイナス符号と円記号を付ける', () => {
      expect(formatCurrency(-5678)).toBe('-¥5,678');
    });
  });

  describe('ゼロ', () => {
    it('符号なしで表示する', () => {
      expect(formatCurrency(0)).toBe('¥0');
    });
  });

  describe('境界値', () => {
    it('1円', () => {
      expect(formatCurrency(1)).toBe('+¥1');
    });

    it('-1円', () => {
      expect(formatCurrency(-1)).toBe('-¥1');
    });

    it('大きな値', () => {
      expect(formatCurrency(999999999)).toBe('+¥999,999,999');
    });
  });
});

describe('formatAmount', () => {
  it('符号なしで円記号を付ける', () => {
    expect(formatAmount(1234)).toBe('¥1,234');
  });

  it('負の値も絶対値で表示する', () => {
    expect(formatAmount(-5678)).toBe('¥5,678');
  });
});
```

#### 例: calcTotal

```typescript
import { describe, it, expect } from 'vitest';
import { calcTotal, calcIncome, calcExpense } from './summary';
import type { Transaction } from '@/types';

// テストフィクスチャ
const createTransaction = (amount: number): Transaction => ({
  id: 'test-id',
  date: new Date('2025-01-01'),
  description: 'テスト',
  amount,
  institution: 'テスト銀行',
  category: '食費',
  subcategory: '食料品',
  memo: '',
  isTransfer: false,
  isCalculated: true,
});

describe('calcTotal', () => {
  it('空配列はゼロを返す', () => {
    expect(calcTotal([])).toBe(0);
  });

  it('全ての金額を合計する', () => {
    const transactions = [
      createTransaction(1000),
      createTransaction(-500),
      createTransaction(300),
    ];
    expect(calcTotal(transactions)).toBe(800);
  });
});

describe('calcIncome', () => {
  it('正の金額のみを合計する', () => {
    const transactions = [
      createTransaction(1000),
      createTransaction(-500),
      createTransaction(2000),
    ];
    expect(calcIncome(transactions)).toBe(3000);
  });

  it('収入がなければゼロ', () => {
    const transactions = [
      createTransaction(-500),
      createTransaction(-300),
    ];
    expect(calcIncome(transactions)).toBe(0);
  });
});

describe('calcExpense', () => {
  it('負の金額の絶対値を合計する', () => {
    const transactions = [
      createTransaction(1000),
      createTransaction(-500),
      createTransaction(-300),
    ];
    expect(calcExpense(transactions)).toBe(800);
  });
});
```

### 4. サービス層（services/）

#### テストパターン

外部依存（fetch）はモック化。エラーケースも必ずテスト。

#### 例: parseTSV

```typescript
import { describe, it, expect } from 'vitest';
import { parseTSV } from './dataParser';
import { DataParseError } from '@/schemas';

describe('parseTSV', () => {
  describe('正常系', () => {
    it('TSVをオブジェクト配列に変換する', () => {
      const tsv = '名前\t年齢\n太郎\t30\n花子\t25';
      const result = parseTSV(tsv);

      expect(result).toEqual([
        { '名前': '太郎', '年齢': '30' },
        { '名前': '花子', '年齢': '25' },
      ]);
    });

    it('1行のデータを処理できる', () => {
      const tsv = 'col1\tcol2\nval1\tval2';
      const result = parseTSV(tsv);

      expect(result).toHaveLength(1);
    });

    it('空文字列のセルを処理できる', () => {
      const tsv = 'a\tb\tc\n1\t\t3';
      const result = parseTSV(tsv);

      expect(result[0]).toEqual({ 'a': '1', 'b': '', 'c': '3' });
    });
  });

  describe('異常系', () => {
    it('空のTSVでDataParseErrorをスロー', () => {
      expect(() => parseTSV('')).toThrow(DataParseError);
    });

    it('ヘッダーのみでDataParseErrorをスロー', () => {
      expect(() => parseTSV('col1\tcol2')).toThrow(DataParseError);
    });

    it('カラム数不一致でDataParseErrorをスロー', () => {
      const tsv = 'a\tb\n1\t2\t3';
      expect(() => parseTSV(tsv)).toThrow('Column count mismatch');
    });
  });
});
```

#### 例: transformTransactions

```typescript
import { describe, it, expect } from 'vitest';
import { transformTransactions } from './dataTransformer';

describe('transformTransactions', () => {
  it('生データをTransaction型に変換する', () => {
    const raw = [{
      'ID': 'abc123',
      '日付': '2025/12/25',
      '内容': 'スーパー',
      '金額（円）': '-1000',
      '保有金融機関': 'みずほ銀行',
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
      subcategory: '食料品',
      isTransfer: false,
      isCalculated: true,
    });
    expect(result[0].date).toEqual(new Date(2025, 11, 25));
  });

  it('不正なデータはスキップする', () => {
    const raw = [
      { '日付': '2025/12/25', '金額（円）': '1000', '保有金融機関': 'A', '大項目': 'X', '中項目': 'Y', 'メモ': '', '振替': '0', '計算対象': '1', '内容': 'OK', 'ID': '1' },
      { '日付': 'invalid', '金額（円）': '1000', '保有金融機関': 'A', '大項目': 'X', '中項目': 'Y', 'メモ': '', '振替': '0', '計算対象': '1', '内容': 'NG', 'ID': '2' },
    ];

    const result = transformTransactions(raw);
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('OK');
  });

  it('IDがない場合は自動生成する', () => {
    const raw = [{
      '日付': '2025/01/01',
      '金額（円）': '500',
      '保有金融機関': 'A',
      '大項目': 'X',
      '中項目': 'Y',
      'メモ': '',
      '振替': '0',
      '計算対象': '1',
      '内容': 'Test',
    }];

    const result = transformTransactions(raw);
    expect(result[0].id).toBeTruthy();
    expect(result[0].id.length).toBeGreaterThan(0);
  });
});
```

#### 例: loadTSV（fetch モック）

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadTSV } from './dataLoader';
import { DataLoadError } from '@/schemas';

describe('loadTSV', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('TSVファイルを読み込む', async () => {
    const mockTSV = 'col1\tcol2\nval1\tval2';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockTSV),
    });

    const result = await loadTSV();

    expect(result).toBe(mockTSV);
    expect(fetch).toHaveBeenCalledWith('/data/data.tsv');
  });

  it('HTTP エラー時に DataLoadError をスロー', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(loadTSV()).rejects.toThrow(DataLoadError);
  });

  it('ネットワークエラー時に DataLoadError をスロー', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(loadTSV()).rejects.toThrow(DataLoadError);
  });
});
```

---

## モック戦略

### モック対象

| 対象 | モック方法 | 理由 |
|------|-----------|------|
| fetch | `vi.fn()` | 外部リソースへの依存を排除 |
| Context | テストラッパー | 状態の制御 |
| 日付 | `vi.useFakeTimers()` | 時間依存テストの安定化 |
| ランダム値 | `vi.spyOn(Math, 'random')` | 予測可能な値に固定 |

### fetch モックの例

```typescript
// グローバル fetch をモック
global.fetch = vi.fn();

// 成功レスポンス
(fetch as vi.Mock).mockResolvedValue({
  ok: true,
  text: () => Promise.resolve('data'),
});

// エラーレスポンス
(fetch as vi.Mock).mockResolvedValue({
  ok: false,
  status: 500,
});

// ネットワークエラー
(fetch as vi.Mock).mockRejectedValue(new Error('Network error'));
```

### Context モックの例

```typescript
// テスト用の Context プロバイダー
const mockTransactions: Transaction[] = [
  // テストデータ
];

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TransactionContext.Provider value={{
    transactions: mockTransactions,
    isLoading: false,
    error: null,
    reload: vi.fn(),
  }}>
    {children}
  </TransactionContext.Provider>
);

// 使用
render(<Component />, { wrapper: TestWrapper });
```

### 日付モックの例

```typescript
describe('日付関連のテスト', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('現在月を取得する', () => {
    expect(getCurrentMonth()).toBe(6);
  });
});
```

---

## テストデータ・フィクスチャ

### ファクトリー関数

再利用可能なテストデータ生成関数を用意。

```typescript
// tests/factories/transaction.ts
import type { Transaction } from '@/types';

let idCounter = 0;

export function createTransaction(
  overrides: Partial<Transaction> = {}
): Transaction {
  idCounter++;
  return {
    id: `test-${idCounter}`,
    date: new Date('2025-01-15'),
    description: 'テスト取引',
    amount: -1000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
    ...overrides,
  };
}

export function createTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, () => createTransaction());
}

// 特定シナリオ用
export function createIncomeTransaction(amount: number = 50000): Transaction {
  return createTransaction({
    amount,
    category: '収入',
    subcategory: '給与',
  });
}

export function createExpenseTransaction(amount: number = -1000): Transaction {
  return createTransaction({
    amount,
    category: '食費',
    subcategory: '外食',
  });
}
```

### 使用例

```typescript
import { createTransaction, createIncomeTransaction } from '@/tests/factories/transaction';

describe('calcTotal', () => {
  it('収支を合計する', () => {
    const transactions = [
      createIncomeTransaction(100000),
      createTransaction({ amount: -30000 }),
      createTransaction({ amount: -20000 }),
    ];

    expect(calcTotal(transactions)).toBe(50000);
  });
});
```

---

## カバレッジ要件

### 目標カバレッジ

| 対象 | 行カバレッジ | 分岐カバレッジ |
|------|-------------|---------------|
| utils/ | 90%以上 | 85%以上 |
| services/ | 85%以上 | 80%以上 |
| hooks/ | 80%以上 | 75%以上 |
| components/ | 75%以上 | 70%以上 |

### カバレッジ除外

```typescript
// vite.config.ts
coverage: {
  exclude: [
    'src/**/*.test.{ts,tsx}',  // テストファイル自体
    'src/**/index.ts',          // re-export のみのファイル
    'src/types/**',             // 型定義のみ
    'src/constants/**',         // 定数定義のみ
  ],
}
```

### カバレッジレポート確認

```bash
npm run test:coverage
# coverage/index.html をブラウザで開く
```

---

## テストケース一覧

### UIコンポーネント

#### Amount

| テストケース | 期待結果 |
|-------------|---------|
| 正の金額表示 | `+¥1,234` 形式で表示 |
| 負の金額表示 | `-¥1,234` 形式で表示 |
| ゼロ表示 | `¥0` 形式で表示 |
| 収入色 | `text-income` クラス適用 |
| 支出色 | `text-expense` クラス適用 |
| サイズ sm | 小さいフォント |
| サイズ lg | 大きいフォント |

#### Button

| テストケース | 期待結果 |
|-------------|---------|
| クリック | onClick 発火 |
| disabled | クリック無効 |
| variant primary | プライマリスタイル |
| variant secondary | セカンダリスタイル |

#### Card

| テストケース | 期待結果 |
|-------------|---------|
| children 表示 | 子要素がレンダリング |
| title 表示 | タイトルが表示 |
| カスタム className | クラスがマージ |

#### Skeleton

| テストケース | 期待結果 |
|-------------|---------|
| デフォルト表示 | ローディングプレースホルダー表示 |
| サイズ指定 | 指定サイズで表示 |

### チャートコンポーネント

#### MonthlyTrendChart

| テストケース | 期待結果 |
|-------------|---------|
| データ表示 | 12ヶ月分の棒グラフ |
| 凡例表示 | 収入・支出の凡例 |
| 空データ | 空状態メッセージ |

#### CategoryPieChart

| テストケース | 期待結果 |
|-------------|---------|
| カテゴリ表示 | 円グラフでカテゴリ別表示 |
| ラベル表示 | パーセンテージラベル |
| 色分け | カテゴリ色適用 |

### サービス

#### parseTSV

| テストケース | 期待結果 |
|-------------|---------|
| 正常 TSV | オブジェクト配列 |
| 空文字列 | DataParseError |
| ヘッダーのみ | DataParseError |
| カラム数不一致 | DataParseError (行番号付き) |

#### transformTransactions

| テストケース | 期待結果 |
|-------------|---------|
| 正常変換 | Transaction 配列 |
| 日付不正 | スキップ |
| 金額不正 | スキップ |
| ID 欠損 | 自動生成 |
| 振替フラグ | boolean 変換 |

#### loadTSV

| テストケース | 期待結果 |
|-------------|---------|
| 成功 | TSV 文字列 |
| HTTP 404 | DataLoadError |
| HTTP 500 | DataLoadError |
| ネットワークエラー | DataLoadError |

### ユーティリティ

#### formatCurrency

| テストケース | 期待結果 |
|-------------|---------|
| 正の値 | `+¥X,XXX` |
| 負の値 | `-¥X,XXX` |
| ゼロ | `¥0` |
| 大きな値 | 3桁区切り |

#### calcTotal / calcIncome / calcExpense

| テストケース | 期待結果 |
|-------------|---------|
| 空配列 | 0 |
| 正負混合 | 正しい合計 |
| 正のみ | 収入合計 |
| 負のみ | 支出合計 |

#### filterByMonth / filterByYear

| テストケース | 期待結果 |
|-------------|---------|
| 該当あり | フィルター済み配列 |
| 該当なし | 空配列 |
| 境界日時 | 正しく含む/除外 |

---

## テスト実行の流れ

### 開発時

```bash
# ウォッチモードで関連テストのみ実行
npm run test

# 特定ファイルのみ
npm run test -- Amount

# 特定パスのみ
npm run test -- src/utils/
```

### CI/CD 時

```bash
# 全テスト + カバレッジ
npm run test:coverage -- --run

# 失敗時は即終了
npm run test -- --run --bail
```

### pre-commit フック

lint-staged で TypeScript ファイル変更時にリント・フォーマットを実行。
テストは CI で実行し、pre-commit では実行しない（高速なコミットを優先）。

---

## トラブルシューティング

### よくある問題

#### テストが見つからない

```bash
# 設定確認
# vite.config.ts の test.include パターンを確認
include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}']
```

#### Context 外でフック使用エラー

```typescript
// ラッパーを追加
const wrapper = ({ children }) => (
  <TransactionProvider>{children}</TransactionProvider>
);
renderHook(() => useTransactions(), { wrapper });
```

#### 非同期テストのタイムアウト

```typescript
// waitFor でタイムアウト延長
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
}, { timeout: 3000 });
```

#### モックがリセットされない

```typescript
beforeEach(() => {
  vi.clearAllMocks();  // 呼び出し履歴クリア
});

afterEach(() => {
  vi.restoreAllMocks();  // 元の実装に戻す
});
```

---

## 参考資料

- [Vitest 公式ドキュメント](https://vitest.dev/)
- [React Testing Library 公式ドキュメント](https://testing-library.com/docs/react-testing-library/intro/)
- [t-wada TDD Boot Camp](https://github.com/twada/tddbc)
