# ディレクトリ構造仕様書

## 概要

家計簿ダッシュボードアプリケーションのディレクトリ構造定義。
React 19 + TypeScript + Vite + Tailwind CSS v4 + Recharts を使用。

---

## 設計方針

### 1. レイヤード・コンポーネントアーキテクチャ

```
UI層（見た目）→ 機能層（ロジック）→ データ層（状態・API）
```

### 2. 分類基準

| 分類 | 基準 |
|------|------|
| `components/ui/` | 再利用可能な汎用UIパーツ（プロジェクト非依存） |
| `components/charts/` | Rechartsベースのチャートコンポーネント |
| `components/dashboard/` | ダッシュボード固有の複合コンポーネント |
| `components/layout/` | ページ構造・レイアウト |
| `features/` | 機能単位でまとめたモジュール（将来拡張用） |

### 3. コロケーション原則

- 関連するファイルは近くに配置
- コンポーネントとそのテスト・スタイルは同一ディレクトリ

---

## ディレクトリツリー

```
kakeibo/
├── public/                          # 静的ファイル
│   ├── favicon.ico
│   └── fonts/                       # Webフォント（Noto Sans JP等）
│
├── src/
│   ├── components/                  # UIコンポーネント
│   │   │
│   │   ├── ui/                      # 汎用UIパーツ
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Badge/
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── SearchInput.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Table/
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── TableHeader.tsx
│   │   │   │   ├── TableRow.tsx
│   │   │   │   ├── TableCell.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Icon/
│   │   │   │   ├── Icon.tsx           # Lucide Iconsラッパー
│   │   │   │   ├── CategoryIcon.tsx   # カテゴリ別アイコン
│   │   │   │   └── index.ts
│   │   │   ├── Amount/
│   │   │   │   ├── Amount.tsx         # 金額表示（色分け対応）
│   │   │   │   └── index.ts
│   │   │   ├── Trend/
│   │   │   │   ├── TrendIndicator.tsx # 前月比▲▼表示
│   │   │   │   └── index.ts
│   │   │   ├── Skeleton/
│   │   │   │   ├── Skeleton.tsx       # ローディング表示
│   │   │   │   └── index.ts
│   │   │   └── index.ts               # 一括エクスポート
│   │   │
│   │   ├── charts/                  # チャートコンポーネント
│   │   │   ├── ChartContainer/
│   │   │   │   ├── ChartContainer.tsx # 共通チャートラッパー
│   │   │   │   └── index.ts
│   │   │   ├── MonthlyTrendChart/
│   │   │   │   ├── MonthlyTrendChart.tsx    # 月別収支推移（折れ線）
│   │   │   │   └── index.ts
│   │   │   ├── CategoryPieChart/
│   │   │   │   ├── CategoryPieChart.tsx     # カテゴリ別円グラフ
│   │   │   │   └── index.ts
│   │   │   ├── CategoryBarChart/
│   │   │   │   ├── CategoryBarChart.tsx     # カテゴリ別棒グラフ
│   │   │   │   └── index.ts
│   │   │   ├── SubcategoryChart/
│   │   │   │   ├── SubcategoryChart.tsx     # 中項目ドリルダウン
│   │   │   │   └── index.ts
│   │   │   ├── InstitutionChart/
│   │   │   │   ├── InstitutionChart.tsx     # 金融機関別
│   │   │   │   └── index.ts
│   │   │   ├── IncomeChart/
│   │   │   │   ├── IncomeChart.tsx          # 収入源内訳
│   │   │   │   └── index.ts
│   │   │   ├── HeatmapChart/
│   │   │   │   ├── HeatmapChart.tsx         # 月×カテゴリヒートマップ
│   │   │   │   └── index.ts
│   │   │   ├── shared/
│   │   │   │   ├── CustomTooltip.tsx        # カスタムツールチップ
│   │   │   │   ├── CustomLegend.tsx         # カスタム凡例
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/               # ダッシュボード固有コンポーネント
│   │   │   ├── SummaryCards/
│   │   │   │   ├── SummaryCards.tsx         # サマリーカード群
│   │   │   │   ├── IncomeCard.tsx           # 収入カード
│   │   │   │   ├── ExpenseCard.tsx          # 支出カード
│   │   │   │   ├── BalanceCard.tsx          # 収支カード
│   │   │   │   └── index.ts
│   │   │   ├── FilterPanel/
│   │   │   │   ├── FilterPanel.tsx          # フィルターパネル
│   │   │   │   ├── PeriodFilter.tsx         # 期間フィルター
│   │   │   │   ├── CategoryFilter.tsx       # カテゴリフィルター
│   │   │   │   ├── InstitutionFilter.tsx    # 金融機関フィルター
│   │   │   │   └── index.ts
│   │   │   ├── TransactionTable/
│   │   │   │   ├── TransactionTable.tsx     # 明細テーブル
│   │   │   │   ├── TransactionRow.tsx       # 明細行
│   │   │   │   ├── TablePagination.tsx      # ページネーション
│   │   │   │   └── index.ts
│   │   │   ├── RankingList/
│   │   │   │   ├── RankingList.tsx          # ランキングリスト
│   │   │   │   ├── RankingItem.tsx          # ランキング項目
│   │   │   │   └── index.ts
│   │   │   ├── HighExpenseList/
│   │   │   │   ├── HighExpenseList.tsx      # 高額支出リスト
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                  # レイアウトコンポーネント
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── index.ts
│   │   │   ├── DashboardGrid/
│   │   │   │   ├── DashboardGrid.tsx        # グリッドレイアウト
│   │   │   │   ├── GridItem.tsx             # グリッドアイテム
│   │   │   │   └── index.ts
│   │   │   ├── Section/
│   │   │   │   ├── Section.tsx              # セクション区切り
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                 # 全コンポーネント一括エクスポート
│   │
│   ├── hooks/                       # カスタムフック
│   │   ├── useTransactions.ts       # 取引データ取得・管理
│   │   ├── useFilteredData.ts       # フィルタリング済みデータ
│   │   ├── useMonthlySummary.ts     # 月別サマリー計算
│   │   ├── useCategorySummary.ts    # カテゴリ別集計
│   │   ├── useInstitutionSummary.ts # 金融機関別集計
│   │   ├── useRanking.ts            # ランキング計算
│   │   ├── useTrend.ts              # 前月比計算
│   │   ├── useChartData.ts          # チャート用データ変換
│   │   └── index.ts
│   │
│   ├── contexts/                    # Reactコンテキスト
│   │   ├── FilterContext.tsx        # フィルター状態管理
│   │   ├── TransactionContext.tsx   # 取引データコンテキスト
│   │   └── index.ts
│   │
│   ├── services/                    # データ処理サービス
│   │   ├── dataLoader.ts            # TSVファイル読み込み
│   │   ├── dataParser.ts            # TSVパース処理
│   │   ├── dataTransformer.ts       # データ変換・正規化
│   │   └── index.ts
│   │
│   ├── utils/                       # ユーティリティ関数
│   │   ├── formatters/
│   │   │   ├── currency.ts          # 金額フォーマット（¥1,234）
│   │   │   ├── date.ts              # 日付フォーマット
│   │   │   ├── percentage.ts        # パーセント表示
│   │   │   └── index.ts
│   │   ├── calculations/
│   │   │   ├── summary.ts           # 集計計算
│   │   │   ├── comparison.ts        # 比較計算（前月比等）
│   │   │   ├── ranking.ts           # ランキング計算
│   │   │   └── index.ts
│   │   ├── filters/
│   │   │   ├── dateFilter.ts        # 日付フィルター
│   │   │   ├── categoryFilter.ts    # カテゴリフィルター
│   │   │   ├── amountFilter.ts      # 金額フィルター
│   │   │   └── index.ts
│   │   ├── validators/
│   │   │   ├── transaction.ts       # 取引データバリデーション
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── types/                       # TypeScript型定義
│   │   ├── transaction.ts           # 取引データ型
│   │   ├── summary.ts               # サマリー型
│   │   ├── chart.ts                 # チャートデータ型
│   │   ├── filter.ts                # フィルター型
│   │   └── index.ts
│   │
│   ├── schemas/                     # Zodスキーマ定義（境界バリデーション用）
│   │   ├── transaction.ts           # トランザクション関連スキーマ
│   │   ├── summary.ts               # サマリー関連スキーマ
│   │   ├── filter.ts                # フィルター関連スキーマ
│   │   ├── errors.ts                # カスタムエラー型
│   │   └── index.ts                 # 再エクスポート
│   │
│   ├── constants/                   # 定数定義
│   │   ├── categories.ts            # カテゴリ定義・色
│   │   ├── institutions.ts          # 金融機関定義
│   │   ├── chartColors.ts           # チャート色定義
│   │   ├── breakpoints.ts           # レスポンシブブレークポイント
│   │   └── index.ts
│   │
│   ├── styles/                      # グローバルスタイル
│   │   ├── globals.css              # グローバルCSS・CSS変数
│   │   ├── theme.ts                 # テーマ定義（Tailwind拡張用）
│   │   └── fonts.css                # フォント読み込み
│   │
│   ├── assets/                      # 静的アセット
│   │   └── images/
│   │       └── logo.svg
│   │
│   ├── pages/                       # ページコンポーネント
│   │   ├── Dashboard.tsx            # メインダッシュボード
│   │   └── index.ts
│   │
│   ├── App.tsx                      # アプリケーションルート
│   ├── main.tsx                     # エントリーポイント
│   └── vite-env.d.ts                # Vite型定義
│
├── public/data/                     # 静的データファイル（ブラウザからfetch可能）
│   └── data.tsv                     # 家計データ（元ファイル、/data/data.tsv でアクセス）
│
├── doc/                             # ドキュメント
│   ├── dashboard_design.md          # ダッシュボード要素仕様
│   ├── design_theme.md              # デザインテーマ仕様
│   ├── directory_structure.md       # 本ファイル
│   └── tech_stack.md                # 技術スタック仕様
│
├── tests/                           # E2Eテスト
│   ├── setup.ts
│   └── dashboard.test.ts
│
├── .env                             # 環境変数
├── .env.example                     # 環境変数サンプル
├── .gitignore
├── .prettierrc                      # Prettier設定
├── eslint.config.js                 # ESLint設定（Flat Config）
├── index.html                       # HTMLテンプレート
├── package.json
├── package-lock.json                # npmロックファイル
├── postcss.config.js                # PostCSS設定
├── tailwind.config.ts               # Tailwind CSS設定
├── tsconfig.json                    # TypeScript設定
├── tsconfig.node.json               # Node用TypeScript設定
└── vite.config.ts                   # Vite設定
```

---

## 各ディレクトリ詳細

### `src/components/ui/`

**目的**: プロジェクト非依存の汎用UIコンポーネント

| コンポーネント | 責務 |
|---------------|------|
| `Button` | ボタン（Primary/Secondary/Ghost） |
| `Card` | カードコンテナ |
| `Badge` | バッジ・タグ表示 |
| `Input` | 入力フィールド群 |
| `Table` | テーブル基本構造 |
| `Icon` | アイコンラッパー |
| `Amount` | 金額表示（収入:緑、支出:赤） |
| `Trend` | 前月比インジケーター（▲▼） |
| `Skeleton` | ローディングスケルトン |

### `src/components/charts/`

**目的**: Rechartsベースのチャートコンポーネント

| コンポーネント | チャート種別 | 対応仕様 |
|---------------|-------------|---------|
| `MonthlyTrendChart` | 折れ線グラフ | 月別収支推移 |
| `CategoryPieChart` | 円グラフ | 大項目別支出割合 |
| `CategoryBarChart` | 棒グラフ | 月別カテゴリ比較 |
| `SubcategoryChart` | 棒グラフ | 中項目ドリルダウン |
| `InstitutionChart` | 棒グラフ/円グラフ | 金融機関別分析 |
| `IncomeChart` | 円グラフ | 収入源内訳 |
| `HeatmapChart` | ヒートマップ | 月×カテゴリ比較 |

### `src/components/dashboard/`

**目的**: ダッシュボード固有の複合コンポーネント

| コンポーネント | 責務 | 対応仕様 |
|---------------|------|---------|
| `SummaryCards` | 収入・支出・収支のサマリー表示 | 1. サマリーカード |
| `FilterPanel` | 期間・カテゴリ・金融機関フィルター | 8. 明細テーブル |
| `TransactionTable` | 明細一覧表示（ソート・検索） | 8. 明細テーブル |
| `RankingList` | 中項目別支出TOP10 | 4. 支出ランキング |
| `HighExpenseList` | 高額支出一覧 | 4. 支出ランキング |

### `src/hooks/`

**目的**: データ取得・計算ロジックのカスタムフック

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

### `src/contexts/`

**目的**: アプリケーション状態のグローバル管理

| コンテキスト | 管理する状態 |
|-------------|-------------|
| `FilterContext` | 選択期間、カテゴリ、金融機関、検索キーワード |
| `TransactionContext` | 取引データ全体、ローディング状態 |

### `src/services/`

**目的**: データI/O・変換処理

| サービス | 責務 |
|---------|------|
| `dataLoader` | TSVファイルのfetch |
| `dataParser` | TSV→オブジェクト配列変換 |
| `dataTransformer` | 日付正規化、金額符号処理 |

### `src/utils/`

**目的**: 純粋な計算・フォーマット関数

```
utils/
├── formatters/      # 表示フォーマット
│   ├── currency.ts  # formatCurrency(12345) → "¥12,345"
│   ├── date.ts      # formatDate("2025/12/25") → "12月25日"
│   └── percentage.ts # formatPercentage(0.052) → "+5.2%"
│
├── calculations/    # 計算ロジック
│   ├── summary.ts   # calcTotal, calcAverage
│   ├── comparison.ts # calcMonthOverMonth, calcGrowthRate
│   └── ranking.ts   # sortByAmount, getTopN
│
├── filters/         # フィルター関数
│   ├── dateFilter.ts    # filterByMonth, filterByYear
│   ├── categoryFilter.ts # filterByCategory
│   └── amountFilter.ts   # filterByAmountRange
│
└── validators/      # バリデーション
    └── transaction.ts # isValidTransaction
```

### `src/types/`

**目的**: TypeScript型定義

```typescript
// transaction.ts
export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  institution: string;
  category: string;
  subcategory: string;
  memo: string;
  isTransfer: boolean;
  isCalculated: boolean;
}

// summary.ts
export interface MonthlySummary {
  month: string;        // "2025-12"
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

// filter.ts
export interface FilterState {
  year: number;
  month: number | 'all';
  category: string | 'all';
  institution: string | 'all';
  searchQuery: string;
}
```

### `src/constants/`

**目的**: 定数定義

```typescript
// categories.ts
export const CATEGORIES = {
  食費: { color: '#F59E0B', icon: 'utensils' },
  日用品: { color: '#8B5CF6', icon: 'shopping-bag' },
  交通費: { color: '#3B82F6', icon: 'train' },
  // ...
} as const;

// chartColors.ts
export const CHART_COLORS = {
  income: '#059669',
  expense: '#DC2626',
  balance: '#2D6A4F',
};
```

---

## ファイル命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `SummaryCard.tsx` |
| フック | camelCase + use接頭辞 | `useTransactions.ts` |
| ユーティリティ | camelCase | `formatCurrency.ts` |
| 型定義 | camelCase | `transaction.ts` |
| 定数 | camelCase（中身はUPPER_SNAKE） | `categories.ts` |
| テスト | `*.test.tsx` / `*.test.ts` | `Button.test.tsx` |

---

## インポートエイリアス

`tsconfig.json` / `vite.config.ts` で設定

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/utils/*": ["./src/utils/*"],
    "@/types/*": ["./src/types/*"],
    "@/constants/*": ["./src/constants/*"]
  }
}
```

**使用例**:
```typescript
import { Button, Card } from '@/components/ui';
import { useTransactions } from '@/hooks';
import { formatCurrency } from '@/utils/formatters';
import type { Transaction } from '@/types';
```

---

## 実装優先順位

### Phase 1: 基盤構築
1. `types/` - 型定義
2. `services/` - データ読み込み
3. `utils/formatters/` - 基本フォーマッター
4. `constants/` - 定数定義

### Phase 2: UIコンポーネント
5. `components/ui/` - 汎用UIパーツ
6. `components/layout/` - レイアウト

### Phase 3: データ層
7. `hooks/` - カスタムフック
8. `contexts/` - 状態管理

### Phase 4: ダッシュボード
9. `components/charts/` - チャート
10. `components/dashboard/` - ダッシュボード部品
11. `pages/Dashboard.tsx` - メインページ

---

## 拡張ポイント

| 拡張内容 | 対応ディレクトリ |
|---------|----------------|
| 新しいチャート追加 | `components/charts/` |
| 新しいフィルター追加 | `components/dashboard/FilterPanel/` + `hooks/` |
| 予算管理機能 | `features/budget/` 新規作成 |
| データエクスポート | `services/exporter.ts` 追加 |
| 多言語対応 | `i18n/` 新規作成 |
| ダークモード | `contexts/ThemeContext.tsx` + `styles/` |
