# charts/ - チャートコンポーネント

## 責務

Rechartsを使用したデータ可視化コンポーネントを提供する。
チャート用に整形されたデータを受け取り、グラフを描画する。

## 配置するコンポーネント

| コンポーネント | チャート種別 | 用途 |
|---------------|-------------|------|
| `ChartContainer` | - | 共通ラッパー（タイトル、ローディング） |
| `MonthlyTrendChart` | LineChart | 月別収支推移 |
| `CategoryPieChart` | PieChart | カテゴリ別支出割合 |
| `CategoryBarChart` | BarChart | 月別カテゴリ比較 |
| `SubcategoryChart` | BarChart | 中項目ドリルダウン |
| `InstitutionChart` | BarChart / PieChart | 金融機関別分析 |
| `IncomeChart` | PieChart | 収入源内訳 |
| `HeatmapChart` | カスタム | 月×カテゴリヒートマップ |

## 設計原則

### 1. データ形式の統一

各チャートは整形済みデータを受け取る。データ変換は hooks で行う。

```typescript
// Good: 整形済みデータを受け取る
type MonthlyTrendChartProps = {
  data: Array<{
    month: string;    // "1月", "2月", ...
    income: number;
    expense: number;
    balance: number;
  }>;
};

// Bad: 生データを受け取って内部で変換
type MonthlyTrendChartProps = {
  transactions: Transaction[];  // ← 変換はhooksの責務
};
```

### 2. ResponsiveContainer必須

すべてのチャートは ResponsiveContainer でラップする。

```typescript
import { ResponsiveContainer, LineChart, Line } from 'recharts';

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        {/* ... */}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### 3. ChartContainerの使用

タイトルやローディング状態は ChartContainer で統一。

```typescript
// ChartContainer の使用例
<ChartContainer title="月別収支推移" isLoading={isLoading}>
  <MonthlyTrendChart data={data} />
</ChartContainer>
```

```typescript
// ChartContainer の実装
type ChartContainerProps = {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
};

export function ChartContainer({ title, children, isLoading, className }: ChartContainerProps) {
  return (
    <div className={cn('bg-surface rounded-lg shadow-md p-6', className)}>
      <h3 className="text-h3 font-semibold text-text-primary mb-4">{title}</h3>
      {isLoading ? <ChartSkeleton /> : children}
    </div>
  );
}
```

### 4. カラー定数の使用

`constants/chartColors.ts` で定義された色を使用する。

```typescript
import { CHART_COLORS, CATEGORY_COLORS } from '@/constants';

// 収支推移
<Line dataKey="income" stroke={CHART_COLORS.income} />
<Line dataKey="expense" stroke={CHART_COLORS.expense} />

// カテゴリ別
{data.map((entry, index) => (
  <Cell key={index} fill={CATEGORY_COLORS[entry.category]} />
))}
```

## 共通コンポーネント（shared/）

### CustomTooltip

統一されたツールチップデザイン。

```typescript
type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  formatter?: (value: number) => string;
};

export function CustomTooltip({ active, payload, label, formatter = formatCurrency }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <div className="bg-surface border border-border rounded-md shadow-lg p-3">
      <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatter(entry.value)}
        </p>
      ))}
    </div>
  );
}
```

### CustomLegend

統一された凡例デザイン。

```typescript
export function CustomLegend({ payload }: { payload?: LegendPayload[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-text-secondary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
```

## 個別チャート仕様

### MonthlyTrendChart

```typescript
type MonthlyTrendData = {
  month: string;
  income: number;
  expense: number;
  balance: number;
};

type MonthlyTrendChartProps = {
  data: MonthlyTrendData[];
  showBalance?: boolean;  // 収支線を表示するか（デフォルト: true）
};
```

### CategoryPieChart

```typescript
type CategoryData = {
  category: string;
  value: number;
  percentage: number;
};

type CategoryPieChartProps = {
  data: CategoryData[];
  onCategoryClick?: (category: string) => void;  // ドリルダウン用
};
```

### HeatmapChart

Rechartsには標準ヒートマップがないため、カスタム実装。

```typescript
type HeatmapData = {
  month: string;
  category: string;
  value: number;
  intensity: number;  // 0-1の正規化値
};

type HeatmapChartProps = {
  data: HeatmapData[];
  months: string[];
  categories: string[];
};
```

## インタラクション

### クリックイベント

ドリルダウン等のためにクリックイベントをサポート。

```typescript
// 円グラフのセグメントクリック
<Pie
  data={data}
  onClick={(_, index) => onCategoryClick?.(data[index].category)}
  style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
/>
```

### ホバーエフェクト

```typescript
// アクティブ状態のスタイル
<Line
  activeDot={{ r: 6, fill: CHART_COLORS.income }}
/>

<Bar
  activeBar={{ fill: CATEGORY_COLORS.食費, opacity: 0.8 }}
/>
```

## テスト観点

チャートのテストは描画確認が中心。インタラクションテストも行う。

```typescript
describe('MonthlyTrendChart', () => {
  const mockData = [
    { month: '1月', income: 500000, expense: 300000, balance: 200000 },
    { month: '2月', income: 480000, expense: 320000, balance: 160000 },
  ];

  it('チャートがレンダリングされる', () => {
    render(<MonthlyTrendChart data={mockData} />);
    // Rechartsはsvgを生成する
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('凡例が表示される', () => {
    render(<MonthlyTrendChart data={mockData} />);
    expect(screen.getByText('収入')).toBeInTheDocument();
    expect(screen.getByText('支出')).toBeInTheDocument();
  });
});

describe('CategoryPieChart', () => {
  it('カテゴリクリックでコールバックが呼ばれる', async () => {
    const handleClick = vi.fn();
    render(<CategoryPieChart data={mockData} onCategoryClick={handleClick} />);

    // Pieチャートのセグメントをクリック
    const segment = document.querySelector('.recharts-pie-sector');
    await userEvent.click(segment!);

    expect(handleClick).toHaveBeenCalled();
  });
});
```

## 禁止事項

1. **データ変換ロジック**: 生データからの変換は hooks で行う
2. **直接的な色のハードコード**: constants から参照する
3. **ResponsiveContainer の省略**: レスポンシブ対応必須
4. **過度なアニメーション**: パフォーマンスに影響する派手なアニメーションは避ける

## パフォーマンス考慮

```typescript
// Good: メモ化で不要な再レンダリングを防ぐ
export const MonthlyTrendChart = memo(function MonthlyTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer>
      {/* ... */}
    </ResponsiveContainer>
  );
});

// データ点が多い場合は間引きを検討
const sampledData = useMemo(() => {
  if (data.length <= 12) return data;
  // 間引きロジック
}, [data]);
```
