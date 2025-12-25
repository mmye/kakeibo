# dashboard/ - ダッシュボード固有コンポーネント

## 責務

家計簿ダッシュボードに特化した複合コンポーネントを提供する。
ui/ や charts/ のコンポーネントを組み合わせ、ダッシュボードの各セクションを構成する。

## 配置するコンポーネント

| コンポーネント | 責務 | 対応する仕様 |
|---------------|------|-------------|
| `SummaryCards` | 収入・支出・収支のサマリー表示 | 1. サマリーカード |
| `FilterPanel` | 期間・カテゴリ・金融機関フィルター | 8. 明細テーブル（フィルター部分） |
| `TransactionTable` | 明細一覧表示（ソート・検索） | 8. 明細テーブル |
| `RankingList` | 中項目別支出TOP10 | 4. 支出ランキング |
| `HighExpenseList` | 高額支出一覧 | 4. 支出ランキング |

## 設計原則

### 1. Hooks経由でデータ取得

コンポーネント内でデータ取得ロジックを書かず、カスタムフックを使用する。

```typescript
// Good: フックからデータを受け取る
export function SummaryCards() {
  const { income, expense, balance, trend } = useMonthlySummary();
  const isLoading = useIsLoading();

  if (isLoading) return <SummaryCardsSkeleton />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <IncomeCard value={income} trend={trend.income} />
      <ExpenseCard value={expense} trend={trend.expense} />
      <BalanceCard value={balance} trend={trend.balance} />
    </div>
  );
}

// Bad: コンポーネント内でデータ計算
export function SummaryCards({ transactions }: { transactions: Transaction[] }) {
  const income = transactions.filter(t => t.amount > 0).reduce(...);  // ← hooksの責務
  // ...
}
```

### 2. Context経由でフィルター状態を共有

フィルター状態は FilterContext で管理し、各コンポーネントが参照する。

```typescript
// FilterPanel がフィルター状態を更新
export function FilterPanel() {
  const { filters, setFilters } = useFilterContext();

  return (
    <div className="flex flex-wrap gap-4">
      <PeriodFilter
        value={filters.month}
        onChange={(month) => setFilters({ ...filters, month })}
      />
      <CategoryFilter
        value={filters.category}
        onChange={(category) => setFilters({ ...filters, category })}
      />
      {/* ... */}
    </div>
  );
}

// 他のコンポーネントはフィルター済みデータを使用
export function TransactionTable() {
  const { data } = useFilteredData();  // ← フィルター適用済み
  // ...
}
```

### 3. サブコンポーネントへの分割

複雑なコンポーネントは適切にサブコンポーネントに分割する。

```
SummaryCards/
├── SummaryCards.tsx      # メインコンポーネント（レイアウト）
├── IncomeCard.tsx        # 収入カード
├── ExpenseCard.tsx       # 支出カード
├── BalanceCard.tsx       # 収支カード
├── SummaryCards.test.tsx
└── index.ts

FilterPanel/
├── FilterPanel.tsx       # メインコンポーネント（レイアウト）
├── PeriodFilter.tsx      # 期間フィルター
├── CategoryFilter.tsx    # カテゴリフィルター
├── InstitutionFilter.tsx # 金融機関フィルター
├── FilterPanel.test.tsx
└── index.ts
```

## 個別コンポーネント仕様

### SummaryCards

3つのサマリーカード（収入・支出・収支）を横並びで表示。

```typescript
// 各カードの構成
┌─────────────────────────┐
│ [アイコン] 月間収入       │  ← ラベル
│                         │
│ +¥483,127               │  ← 金額（大サイズ）
│ ▲ 5.2%                  │  ← 前月比
└─────────────────────────┘

// カード左側にアクセントボーダー
// - 収入: Income色 (#059669)
// - 支出: Expense色 (#DC2626)
// - 収支: Primary色 (#2D6A4F)
```

### FilterPanel

横並びのフィルター群。レスポンシブで折り返し。

```typescript
type FilterState = {
  year: number;
  month: number | 'all';
  category: string | 'all';
  institution: string | 'all';
  searchQuery: string;
};

// フィルター変更時は即座に反映（デバウンス不要、データはメモリ上）
```

### TransactionTable

ソート・ページネーション付きの明細テーブル。

```typescript
type TransactionTableProps = {
  pageSize?: number;  // デフォルト: 20
};

// ソート可能カラム
// - 日付（デフォルト: 降順）
// - 金額
// - カテゴリ

// 各行の構成
| 日付 | 内容 | カテゴリ | 金融機関 | 金額 |
```

### RankingList

支出の多い中項目TOP10を表示。

```typescript
type RankingItem = {
  rank: number;
  subcategory: string;
  category: string;    // 親カテゴリ
  amount: number;
  percentage: number;  // 全支出に対する割合
};

// 表示例
// 1. 食料品（食費）     ¥45,230  15.2%
// 2. 保育園（教養・教育） ¥165,600  55.6%
// ...
```

### HighExpenseList

高額な個別支出を表示（閾値以上）。

```typescript
type HighExpenseListProps = {
  threshold?: number;  // デフォルト: 10000円
  limit?: number;      // デフォルト: 10件
};

// 表示例
// 12/5  スキンフィニティクリニック  ¥52,800
// 12/13 エクスプレス予約           ¥24,260
// ...
```

## テスト観点

### SummaryCards

```typescript
describe('SummaryCards', () => {
  it('収入・支出・収支の3カードが表示される', () => {
    render(<SummaryCards />);
    expect(screen.getByText('月間収入')).toBeInTheDocument();
    expect(screen.getByText('月間支出')).toBeInTheDocument();
    expect(screen.getByText('収支バランス')).toBeInTheDocument();
  });

  it('ローディング中はスケルトンが表示される', () => {
    // useIsLoading が true を返すようモック
    render(<SummaryCards />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });
});
```

### FilterPanel

```typescript
describe('FilterPanel', () => {
  it('月を変更するとフィルターが更新される', async () => {
    const setFilters = vi.fn();
    // FilterContext をモック
    render(<FilterPanel />);

    await userEvent.selectOptions(screen.getByLabelText('月'), '12');

    expect(setFilters).toHaveBeenCalledWith(expect.objectContaining({ month: 12 }));
  });
});
```

### TransactionTable

```typescript
describe('TransactionTable', () => {
  it('取引一覧が表示される', () => {
    render(<TransactionTable />);
    // 実際のデータに基づく検証
  });

  it('日付ヘッダークリックでソートされる', async () => {
    render(<TransactionTable />);
    await userEvent.click(screen.getByText('日付'));
    // ソート順の検証
  });

  it('ページネーションが機能する', async () => {
    render(<TransactionTable />);
    await userEvent.click(screen.getByLabelText('次のページ'));
    // ページ変更の検証
  });
});
```

## 禁止事項

1. **生データの直接計算**: 集計・変換は hooks で行う
2. **フィルター状態のローカル管理**: FilterContext を使用する
3. **ui/ コンポーネントの再実装**: 既存の ui/ コンポーネントを使う
4. **charts/ の直接使用**: ChartContainer でラップして使う

## ui/ との違い

| ui/ | dashboard/ |
|-----|------------|
| プロジェクト非依存 | 家計簿ダッシュボード専用 |
| 単一責任 | 複合コンポーネント |
| props でデータ受け取り | hooks でデータ取得 |
| Context 非依存 | FilterContext 等を使用 |
