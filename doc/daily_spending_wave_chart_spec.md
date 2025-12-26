# 日別支出ウェーブチャート統合仕様書

## 概要

日別の支出データをカテゴリ別に積み上げエリアチャートで可視化するコンポーネント。
`prototype/daily-spending-wave.html` を基に、既存のダッシュボードアーキテクチャに統合する。

### 元プロトタイプの特徴

- **チャートライブラリ**: Highcharts（積み上げエリアチャート）
- **期間**: 90日間の日別データ
- **カテゴリ**: Food, Fun, Transport, Daily Goods, Health, Utility
- **インタラクション**: X軸ズーム、ホバーで詳細表示、凡例クリックでカテゴリ切替
- **デザイン**: Scientific Comic スタイル（角丸、ダッシュ線グリッド）

### 統合後の変更点

| 項目 | プロトタイプ | 統合後 |
|------|-------------|--------|
| ライブラリ | Highcharts | **Recharts** |
| 期間 | 固定90日 | **フィルター連動（月単位 or 全期間）** |
| カテゴリ | 英語固定 | **TSVデータの大項目を使用** |
| データ | モック生成 | **実データから集計** |
| スタイル | Tailwind CDN | **既存テーマ（design_theme.md）** |

---

## コンポーネント仕様

### ファイル配置

```
src/components/charts/DailySpendingChart/
├── DailySpendingChart.tsx       # 本体
├── DailySpendingChart.test.tsx  # テスト
└── index.ts                     # 再エクスポート
```

### コンポーネント定義

```typescript
// DailySpendingChart.tsx
import { ChartContainer } from '../ChartContainer';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';

type DailySpendingChartProps = {
  /** X軸ズーム機能を有効にするか（デフォルト: true） */
  enableZoom?: boolean;
  /** 表示するカテゴリを限定（省略時は全カテゴリ） */
  categories?: string[];
  /** 高さ（px）（デフォルト: 500） */
  height?: number;
};

export function DailySpendingChart({
  enableZoom = true,
  categories,
  height = 500,
}: DailySpendingChartProps);
```

### データ形式

チャートが受け取るデータ形式（`useDailySpending` フックから取得）:

```typescript
type DailySpendingData = {
  /** 日付（YYYY-MM-DD形式） */
  date: string;
  /** 曜日（"月", "火", ...） */
  dayOfWeek: string;
  /** カテゴリ別支出（キー: カテゴリ名、値: 金額） */
  [category: string]: number | string;
  /** 当日合計 */
  total: number;
};

// 例
{
  date: "2025-12-01",
  dayOfWeek: "月",
  食費: 3500,
  交通費: 800,
  日用品: 1200,
  total: 5500
}
```

---

## Hooks仕様

### useDailySpending

日別支出データを集計するカスタムフック。

```typescript
// src/hooks/useDailySpending.ts

type UseDailySpendingReturn = {
  /** 日別支出データ（日付順） */
  data: DailySpendingData[];
  /** 出現するカテゴリ一覧 */
  categories: string[];
  /** 期間合計 */
  totalSpending: number;
  /** 日平均 */
  averageDaily: number;
  /** 最大支出日 */
  peakDay: { date: string; amount: number } | null;
};

function useDailySpending(): UseDailySpendingReturn;
```

### 実装要件

1. **フィルター連動**: `useFilterContext` の year/month に基づいてデータを絞り込む
2. **支出のみ**: `amount < 0` のトランザクションのみ対象
3. **振替除外**: `isTransfer === true` は除外
4. **計算対象のみ**: `isCalculated === true` のみ対象
5. **カテゴリ集計**: 大項目（category）でグループ化
6. **日付でソート**: 昇順でソート

---

## UIデザイン仕様

### カラーパレット

`constants/chartColors.ts` に追加:

```typescript
// 日別チャート用のカテゴリ色
export const DAILY_CATEGORY_COLORS: Record<string, string> = {
  食費: '#F43F5E',      // Sally Rose
  趣味娯楽: '#FBBF24',  // Woodstock Yellow
  交通費: '#38BDF8',    // Blanket Blue
  日用品: '#A78BFA',    // Soft Purple
  健康医療: '#34D399',  // Mint Green
  水道光熱費: '#FB923C', // Orange
  // 既存のCATEGORY_COLORSとマージ可
};
```

### チャートスタイル

| 要素 | スタイル |
|------|---------|
| エリア透明度 | 0.85 |
| 線幅 | 1px（白） |
| グリッド | ダッシュ線（LongDash相当） |
| グリッド色 | `#F3F4F6` |
| クロスヘア | 1px ダッシュ線、`ink-black`（#1F2937） |
| マーカー | デフォルト非表示、ホバー時のみ表示 |

### ツールチップ

```
┌─────────────────────────────────┐
│ 2025.12.25 (木)                 │
├─────────────────────────────────┤
│ ● 食費:        ¥3,500           │
│ ● 交通費:      ¥800             │
│ ● 日用品:      ¥1,200           │
├─────────────────────────────────┤
│ 合計: ¥5,500                    │
└─────────────────────────────────┘
```

- 背景: `rgba(255, 255, 255, 0.98)`
- 角丸: 12px
- シャドウ: `shadow-lg`
- 日付フォーマット: `YYYY.MM.DD (曜日)`

### ズーム機能（Brush）

Rechartsの `<Brush>` コンポーネントでX軸ズームを実装:

```typescript
{enableZoom && (
  <Brush
    dataKey="date"
    height={30}
    stroke={CHART_COLORS.primary}
    tickFormatter={(date) => formatDateShort(date)}
  />
)}
```

---

## レイアウト配置

### ダッシュボードでの位置

月別収支推移チャートの下、カテゴリ別チャートの上に配置。

```
┌─────────────────────────────────────────┐
│           サマリーカード                │
├─────────────────────────────────────────┤
│         月別収支推移チャート            │
├─────────────────────────────────────────┤
│      【日別支出ウェーブチャート】       │  ← 新規追加
├───────────────────┬─────────────────────┤
│ カテゴリ別円グラフ│  カテゴリ別棒グラフ │
└───────────────────┴─────────────────────┘
```

### グリッド占有

`DashboardGrid` で `span: 2`（全幅）を指定。

```typescript
<GridItem span={2}>
  <DailySpendingChart />
</GridItem>
```

---

## インタラクション仕様

### 1. ホバー

- クロスヘア表示（X軸・Y軸の両方）
- ツールチップ表示
- 該当日のデータポイントをハイライト

### 2. 凡例クリック

- カテゴリの表示/非表示を切り替え
- 非表示時は凡例テキストを薄くする

### 3. ブラシ（ズーム）

- チャート下部のブラシ領域をドラッグして期間を絞り込み
- リセットボタンで全期間に戻す

### 4. 日付クリック（オプション）

- 日付をクリックすると、その日の明細をフィルター
- `useFilterContext` と連携

---

## パフォーマンス考慮

### データ量

- 1年分 = 約365日 × カテゴリ数（10程度）= 3,650データポイント
- Rechartsは1万点程度まで許容範囲

### 最適化

1. **メモ化**: `useMemo` でデータ変換を最適化
2. **条件付きレンダリング**: データがない場合は空状態を表示
3. **遅延読み込み**: 必要に応じて `React.lazy` で分割

```typescript
// useDailySpending.ts
export function useDailySpending(): UseDailySpendingReturn {
  const { data: transactions } = useFilteredData();

  return useMemo(() => {
    // 集計ロジック
  }, [transactions]);
}
```

---

## テスト仕様

### ユニットテスト（useDailySpending）

```typescript
describe('useDailySpending', () => {
  it('日別に支出を集計する', () => {
    // ...
  });

  it('収入トランザクションを除外する', () => {
    // ...
  });

  it('振替トランザクションを除外する', () => {
    // ...
  });

  it('フィルター（月）に連動する', () => {
    // ...
  });

  it('カテゴリ一覧を返す', () => {
    // ...
  });
});
```

### コンポーネントテスト（DailySpendingChart）

```typescript
describe('DailySpendingChart', () => {
  it('チャートがレンダリングされる', () => {
    render(<DailySpendingChart />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('凡例にカテゴリが表示される', () => {
    render(<DailySpendingChart />);
    expect(screen.getByText('食費')).toBeInTheDocument();
  });

  it('ズームを無効化できる', () => {
    render(<DailySpendingChart enableZoom={false} />);
    expect(document.querySelector('.recharts-brush')).not.toBeInTheDocument();
  });

  it('データがない場合は空状態を表示', () => {
    // フィルターで空になるケース
    render(<DailySpendingChart />);
    expect(screen.getByText('表示するデータがありません')).toBeInTheDocument();
  });
});
```

---

## 実装チェックリスト

### Phase 1: データ層

- [ ] `types/dailySpending.ts` - 型定義追加
- [ ] `utils/calculations/dailySpending.ts` - 集計関数
- [ ] `hooks/useDailySpending.ts` - カスタムフック
- [ ] テスト作成・通過

### Phase 2: UI層

- [ ] `constants/chartColors.ts` - カテゴリ色追加
- [ ] `components/charts/DailySpendingChart/` - コンポーネント
- [ ] `components/charts/shared/DailyTooltip.tsx` - ツールチップ
- [ ] テスト作成・通過

### Phase 3: 統合

- [ ] `App.tsx` にチャート追加
- [ ] レイアウト調整
- [ ] E2Eテスト（手動確認）

---

## 今後の拡張可能性

1. **週末ハイライト**: 土日の背景色を変える
2. **予算線**: 日別予算をラインで重ねる
3. **アノテーション**: 特定日にマーカーを追加（給料日など）
4. **比較モード**: 前月同期間との比較表示
5. **エクスポート**: PNG/CSV出力機能

---

## 参考

- [Recharts AreaChart ドキュメント](https://recharts.org/en-US/api/AreaChart)
- [prototype/daily-spending-wave.html](../prototype/daily-spending-wave.html)
- [既存チャートコンポーネント](../src/components/charts/)
