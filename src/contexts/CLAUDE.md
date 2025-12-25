# contexts/ - Reactコンテキスト

## 責務

アプリケーション全体で共有する状態を管理する。
Props drilling を避け、離れたコンポーネント間で状態を共有する。

## 配置するコンテキスト

| コンテキスト | 管理する状態 |
|-------------|-------------|
| `FilterContext` | フィルター条件（期間、カテゴリ、金融機関、検索） |
| `TransactionContext` | 取引データ、ローディング状態、エラー |

## 設計原則

### 1. Context は最小限に

本当にグローバルな状態のみ Context 化する。

```typescript
// Good: 複数の離れたコンポーネントで使う状態
// - フィルター条件（FilterPanel と TransactionTable で共有）
// - 取引データ（複数のチャート、テーブルで共有）

// Bad: 1箇所でしか使わない状態
// - モーダルの開閉状態 → ローカル state で十分
// - フォームの入力値 → ローカル state で十分
```

### 2. Provider は App 直下に配置

```typescript
// App.tsx
function App() {
  return (
    <TransactionProvider>
      <FilterProvider>
        <Dashboard />
      </FilterProvider>
    </TransactionProvider>
  );
}
```

### 3. カスタムフック経由でアクセス

Context を直接使わず、専用フックを提供する。

```typescript
// Good: フック経由
const { filters, setFilters } = useFilterContext();

// Bad: 直接 useContext
const context = useContext(FilterContext);
if (!context) throw new Error('...');
```

## 個別コンテキスト仕様

### FilterContext

フィルター状態を管理。

```typescript
// types
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
};

// 実装
const defaultFilters: FilterState = {
  year: new Date().getFullYear(),
  month: 'all',
  category: 'all',
  institution: 'all',
  searchQuery: '',
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters }),
    [filters, resetFilters]
  );

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext(): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within FilterProvider');
  }
  return context;
}
```

### TransactionContext

取引データを管理。

```typescript
// types
type TransactionContextValue = {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
};

// 実装
const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadTransactions();
      setTransactions(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({ transactions, isLoading, error, reload: load }),
    [transactions, isLoading, error, load]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext(): TransactionContextValue {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within TransactionProvider');
  }
  return context;
}
```

## パフォーマンス考慮

### 1. value のメモ化

```typescript
// Good: useMemo で value をメモ化
const value = useMemo(
  () => ({ filters, setFilters }),
  [filters]  // setFilters は useState から来るので安定
);

// Bad: 毎回新しいオブジェクトを生成
<FilterContext.Provider value={{ filters, setFilters }}>
```

### 2. Context の分割

頻繁に変わる状態と安定した状態を分離する。

```typescript
// Good: 分割
<FilterContext.Provider value={filters}>      {/* 頻繁に変化 */}
  <FilterActionsContext.Provider value={actions}>  {/* 安定 */}
    {children}
  </FilterActionsContext.Provider>
</FilterContext.Provider>

// これにより、actions だけ使うコンポーネントは再レンダリングされない
```

### 3. セレクターパターン（必要な場合）

```typescript
// 特定の値だけ取得するフック
function useFilteredMonth() {
  const { filters } = useFilterContext();
  return filters.month;
}

// ただし、このアプリの規模では過剰最適化の可能性あり
// パフォーマンス問題が出てから検討する（YAGNI）
```

## テストの書き方

```typescript
import { renderHook, act } from '@testing-library/react';
import { FilterProvider, useFilterContext } from './FilterContext';

describe('FilterContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FilterProvider>{children}</FilterProvider>
  );

  it('初期値が設定される', () => {
    const { result } = renderHook(() => useFilterContext(), { wrapper });

    expect(result.current.filters).toEqual({
      year: expect.any(Number),
      month: 'all',
      category: 'all',
      institution: 'all',
      searchQuery: '',
    });
  });

  it('フィルターを更新できる', () => {
    const { result } = renderHook(() => useFilterContext(), { wrapper });

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        month: 12,
      });
    });

    expect(result.current.filters.month).toBe(12);
  });

  it('リセットで初期値に戻る', () => {
    const { result } = renderHook(() => useFilterContext(), { wrapper });

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        month: 6,
        category: '食費',
      });
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters.month).toBe('all');
    expect(result.current.filters.category).toBe('all');
  });

  it('Provider外で使うとエラー', () => {
    const { result } = renderHook(() => useFilterContext());
    expect(result.error).toEqual(
      new Error('useFilterContext must be used within FilterProvider')
    );
  });
});
```

## 禁止事項

1. **過度な Context 化**: ローカル state で済むものは Context にしない
2. **ビジネスロジック**: 計算は hooks/ や utils/ で行う
3. **直接 useContext**: 必ずカスタムフック経由でアクセス
4. **Context のネストしすぎ**: 2-3階層まで

## ファイル構成

```
contexts/
├── FilterContext.tsx        # フィルター状態
├── TransactionContext.tsx   # 取引データ
├── index.ts                 # エクスポート
└── CLAUDE.md
```

```typescript
// index.ts
export { FilterProvider, useFilterContext } from './FilterContext';
export { TransactionProvider, useTransactionContext } from './TransactionContext';
```
