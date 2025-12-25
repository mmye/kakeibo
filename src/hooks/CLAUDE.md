# hooks/ - カスタムフック

## 責務

データ取得・状態管理・計算ロジックをカプセル化する。
コンポーネントとデータ層の橋渡し役。

## 配置するフック

| フック | 責務 |
|--------|------|
| `useTransactions` | TSVからデータ読み込み・パース |
| `useFilteredData` | フィルター適用済みデータ取得 |
| `useMonthlySummary` | 月別収入・支出・収支計算 |
| `useCategorySummary` | カテゴリ別集計 |
| `useInstitutionSummary` | 金融機関別集計 |
| `useRanking` | ランキング計算 |
| `useTrend` | 前月比・増減率計算 |
| `useChartData` | チャート用データ変換 |

## 設計原則

### 1. 単一責任

1つのフックは1つの関心事のみを扱う。

```typescript
// Good: 単一責任
function useMonthlySummary() {
  const { data } = useFilteredData();
  return useMemo(() => calcMonthlySummary(data), [data]);
}

function useTrend() {
  const { data } = useFilteredData();
  return useMemo(() => calcTrend(data), [data]);
}

// Bad: 複数の責任
function useDashboardData() {
  // 月別サマリーも、トレンドも、ランキングも全部計算...
}
```

### 2. 計算ロジックは utils に委譲

フック内では計算関数を呼び出すだけ。ロジック本体は utils/ に置く。

```typescript
// Good: utilsの関数を呼び出す
import { calcMonthlySummary } from '@/utils/calculations';

function useMonthlySummary() {
  const { data } = useFilteredData();
  return useMemo(() => calcMonthlySummary(data), [data]);
}

// Bad: フック内で計算ロジックを書く
function useMonthlySummary() {
  const { data } = useFilteredData();
  return useMemo(() => {
    const grouped = data.reduce((acc, t) => { ... }, {});  // ← utilsの責務
    return Object.entries(grouped).map(...);
  }, [data]);
}
```

### 3. メモ化の適切な使用

```typescript
// 計算結果はuseMemoでメモ化
const summary = useMemo(() => calcSummary(data), [data]);

// コールバックはuseCallbackでメモ化（必要な場合のみ）
const handleFilter = useCallback((filter: Filter) => {
  setFilter(filter);
}, []);

// 不要なメモ化はしない
// Bad: プリミティブ値のメモ化
const count = useMemo(() => data.length, [data]);  // ← 不要
```

### 4. 戻り値の設計

```typescript
// オブジェクトで複数の値を返す
function useMonthlySummary() {
  const summary = useMemo(...);
  const isLoading = ...;

  return {
    summary,
    isLoading,
  };
}

// 配列で返すパターン（状態とセッターのペア）
function useFilter() {
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  return [filter, setFilter] as const;
}
```

## 個別フック仕様

### useTransactions

TransactionContext 経由でデータを取得する。データ読み込みは Context が担当。

```typescript
type UseTransactionsReturn = {
  data: Transaction[];
  isLoading: boolean;
  error: Error | null;
};

function useTransactions(): UseTransactionsReturn {
  // TransactionContext経由でデータを取得（Contextがデータ読み込みを担当）
  const { transactions, isLoading, error } = useTransactionContext();
  return { data: transactions, isLoading, error };
}
```

### useFilteredData

フィルター適用済みデータを提供。

```typescript
function useFilteredData() {
  const { data } = useTransactions();
  const { filters } = useFilterContext();

  const filteredData = useMemo(
    () => applyFilters(data, filters),
    [data, filters]
  );

  return { data: filteredData };
}
```

### useMonthlySummary

月別サマリーを計算。

```typescript
type MonthlySummary = {
  month: string;
  income: number;
  expense: number;
  balance: number;
};

function useMonthlySummary(): MonthlySummary[] {
  const { data } = useFilteredData();
  return useMemo(() => calcMonthlySummary(data), [data]);
}
```

### useCategorySummary

カテゴリ別集計を計算。

```typescript
type CategorySummary = {
  category: string;
  amount: number;
  percentage: number;
  color: string;
};

function useCategorySummary(): CategorySummary[] {
  const { data } = useFilteredData();
  return useMemo(() => calcCategorySummary(data), [data]);
}
```

### useRanking

中項目別の支出ランキングを計算。

```typescript
type RankingItem = {
  rank: number;
  subcategory: string;
  category: string;
  amount: number;
  percentage: number;
};

function useRanking(limit: number = 10): RankingItem[] {
  const { data } = useFilteredData();
  return useMemo(() => calcRanking(data, limit), [data, limit]);
}
```

### useTrend

前月比を計算。

```typescript
type TrendData = {
  income: number;   // 変化率 (0.05 = +5%)
  expense: number;
  balance: number;
};

function useTrend(): TrendData {
  const { data } = useTransactions();  // フィルター前のデータが必要
  const { filters } = useFilterContext();
  return useMemo(() => calcTrend(data, filters.month), [data, filters.month]);
}
```

### useChartData

特定のチャート用にデータを変換。

```typescript
// 汎用変換フック
function useChartData<T>(
  transformer: (data: Transaction[]) => T
): T {
  const { data } = useFilteredData();
  return useMemo(() => transformer(data), [data, transformer]);
}

// 使用例
const pieChartData = useChartData(toCategoryPieData);
const trendChartData = useChartData(toMonthlyTrendData);
```

## テストの書き方

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useTransactions } from './useTransactions';

describe('useTransactions', () => {
  it('データを読み込む', async () => {
    const { result } = renderHook(() => useTransactions());

    // 初期状態
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // 読み込み完了を待つ
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data.length).toBeGreaterThan(0);
  });
});

describe('useMonthlySummary', () => {
  it('月別サマリーを計算する', () => {
    // Contextのモックが必要
    const wrapper = ({ children }) => (
      <TransactionProvider testData={mockData}>
        <FilterProvider>
          {children}
        </FilterProvider>
      </TransactionProvider>
    );

    const { result } = renderHook(() => useMonthlySummary(), { wrapper });

    expect(result.current).toEqual([
      { month: '1月', income: 500000, expense: 300000, balance: 200000 },
      // ...
    ]);
  });
});
```

## 禁止事項

1. **UIロジックの記述**: 表示に関する処理はコンポーネントで行う
2. **直接的なデータフェッチ（useTransactions以外）**: services経由で行う
3. **過度な状態管理**: 必要最小限の状態のみ持つ
4. **Context の乱用**: 本当にグローバルな状態のみ Context 化

## フック間の依存関係

```
useTransactions (データ取得)
    ↓
useFilteredData (フィルター適用)
    ↓
┌───────────────┬───────────────┬───────────────┐
useMonthlySummary  useCategorySummary  useRanking  ...
```

下位のフックは上位のフックに依存してよいが、逆は禁止。
