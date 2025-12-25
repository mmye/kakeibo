# constants/ - 定数定義

## 責務

アプリケーション全体で使用する定数を一元管理する。
マジックナンバー・マジックストリングを排除し、変更に強い設計を実現。

## ファイル構成

```
constants/
├── categories.ts    # カテゴリ定義
├── institutions.ts  # 金融機関定義
├── chartColors.ts   # チャート色定義
├── breakpoints.ts   # レスポンシブブレークポイント
├── theme.ts         # テーマ定数
└── index.ts         # 再エクスポート
```

## 設計原則

### 1. as const で型を厳密に

```typescript
// Good: as const で literal type に
export const CHART_COLORS = {
  income: '#059669',
  expense: '#DC2626',
  balance: '#2D6A4F',
} as const;

// 型: { readonly income: "#059669"; readonly expense: "#DC2626"; ... }

// Bad: as const なし
export const CHART_COLORS = {
  income: '#059669',
  // ...
};
// 型: { income: string; expense: string; ... }
```

### 2. 命名規則

```typescript
// 定数名: UPPER_SNAKE_CASE
export const MAX_RANKING_ITEMS = 10;
export const DEFAULT_PAGE_SIZE = 20;

// オブジェクト定数: UPPER_SNAKE_CASE
export const CATEGORY_COLORS = { ... } as const;

// 配列定数: UPPER_SNAKE_CASE（複数形）
export const MONTHS = ['1月', '2月', ...] as const;
```

### 3. 型の導出

定数から型を導出することで、定数と型を同期させる。

```typescript
export const CATEGORIES = {
  食費: { color: '#F59E0B', icon: 'utensils' },
  日用品: { color: '#8B5CF6', icon: 'shopping-bag' },
  // ...
} as const;

// 定数からカテゴリ名の型を導出
export type CategoryName = keyof typeof CATEGORIES;
// → "食費" | "日用品" | ...
```

## 定数定義

### categories.ts

```typescript
import type { LucideIcon } from 'lucide-react';
import {
  Utensils,
  ShoppingBag,
  Train,
  Smartphone,
  GraduationCap,
  HeartPulse,
  Shirt,
  Gamepad2,
  Flame,
  Gift,
  MoreHorizontal,
  Wallet,
} from 'lucide-react';

/**
 * カテゴリ定義
 */
export const CATEGORIES = {
  食費: {
    color: '#F59E0B',
    icon: Utensils,
    label: '食費',
  },
  日用品: {
    color: '#8B5CF6',
    icon: ShoppingBag,
    label: '日用品',
  },
  交通費: {
    color: '#3B82F6',
    icon: Train,
    label: '交通費',
  },
  通信費: {
    color: '#06B6D4',
    icon: Smartphone,
    label: '通信費',
  },
  '教養・教育': {
    color: '#10B981',
    icon: GraduationCap,
    label: '教養・教育',
  },
  '健康・医療': {
    color: '#EC4899',
    icon: HeartPulse,
    label: '健康・医療',
  },
  '衣服・美容': {
    color: '#F97316',
    icon: Shirt,
    label: '衣服・美容',
  },
  '趣味・娯楽': {
    color: '#6366F1',
    icon: Gamepad2,
    label: '趣味・娯楽',
  },
  '水道・光熱費': {
    color: '#14B8A6',
    icon: Flame,
    label: '水道・光熱費',
  },
  交際費: {
    color: '#EF4444',
    icon: Gift,
    label: '交際費',
  },
  収入: {
    color: '#059669',
    icon: Wallet,
    label: '収入',
  },
  その他: {
    color: '#6B7280',
    icon: MoreHorizontal,
    label: 'その他',
  },
} as const;

/** カテゴリ名の型 */
export type CategoryName = keyof typeof CATEGORIES;

/** カテゴリ情報の型 */
export type CategoryInfo = (typeof CATEGORIES)[CategoryName];

/**
 * カテゴリの色を取得
 */
export function getCategoryColor(category: string): string {
  return CATEGORIES[category as CategoryName]?.color ?? CATEGORIES.その他.color;
}

/**
 * カテゴリのアイコンを取得
 */
export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORIES[category as CategoryName]?.icon ?? CATEGORIES.その他.icon;
}

/**
 * カテゴリ一覧（収入を除く）
 */
export const EXPENSE_CATEGORIES = Object.keys(CATEGORIES).filter(
  (c) => c !== '収入'
) as CategoryName[];
```

### institutions.ts

```typescript
/**
 * 金融機関の表示名マッピング
 */
export const INSTITUTIONS = {
  '三菱UFJ銀行': {
    shortName: 'MUFG',
    color: '#CC0033',
  },
  '楽天銀行': {
    shortName: '楽天銀行',
    color: '#BF0000',
  },
  '楽天カード': {
    shortName: '楽天',
    color: '#BF0000',
  },
  '三井住友カード (Vpass ID)': {
    shortName: 'SMCC',
    color: '#00A650',
  },
  'Amazon.co.jp': {
    shortName: 'Amazon',
    color: '#FF9900',
  },
  'セゾンカード（マイレージプラス）': {
    shortName: 'セゾン',
    color: '#0066CC',
  },
} as const;

export type InstitutionName = keyof typeof INSTITUTIONS;

/**
 * 金融機関の短縮名を取得
 */
export function getInstitutionShortName(institution: string): string {
  return INSTITUTIONS[institution as InstitutionName]?.shortName ?? institution;
}
```

### chartColors.ts

```typescript
/**
 * チャート共通色
 */
export const CHART_COLORS = {
  /** 収入 */
  income: '#059669',
  /** 支出 */
  expense: '#DC2626',
  /** 収支 */
  balance: '#2D6A4F',
  /** グリッド線 */
  grid: '#E5E1D8',
  /** ラベル */
  label: '#6B7280',
} as const;

/**
 * カテゴリ別チャート色（配列版）
 * 円グラフなどで順番に使用
 */
export const CATEGORY_CHART_COLORS = [
  '#F59E0B', // 食費
  '#8B5CF6', // 日用品
  '#3B82F6', // 交通費
  '#06B6D4', // 通信費
  '#10B981', // 教養・教育
  '#EC4899', // 健康・医療
  '#F97316', // 衣服・美容
  '#6366F1', // 趣味・娯楽
  '#14B8A6', // 水道・光熱費
  '#EF4444', // 交際費
  '#6B7280', // その他
] as const;

/**
 * ヒートマップ用のカラースケール
 */
export const HEATMAP_COLORS = {
  min: '#D1FAE5',   // 最小値（薄い緑）
  max: '#065F46',   // 最大値（濃い緑）
  zero: '#F3F4F6',  // ゼロ（グレー）
} as const;
```

### breakpoints.ts

```typescript
/**
 * レスポンシブブレークポイント（px）
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * メディアクエリ文字列
 */
export const MEDIA_QUERIES = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
} as const;
```

### theme.ts

```typescript
/**
 * テーマ定数
 * CSS変数と対応
 */
export const THEME = {
  colors: {
    primary: '#2D6A4F',
    primaryLight: '#40916C',
    primaryDark: '#1B4332',
    secondary: '#B07D62',
    income: '#059669',
    expense: '#DC2626',
    background: '#FDFBF7',
    surface: '#FFFFFF',
    border: '#E5E1D8',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  fontSize: {
    display: '32px',
    h1: '24px',
    h2: '20px',
    h3: '16px',
    body: '14px',
    small: '12px',
  },
} as const;
```

### index.ts

```typescript
// 再エクスポート
export {
  CATEGORIES,
  getCategoryColor,
  getCategoryIcon,
  EXPENSE_CATEGORIES,
} from './categories';
export type { CategoryName, CategoryInfo } from './categories';

export {
  INSTITUTIONS,
  getInstitutionShortName,
} from './institutions';
export type { InstitutionName } from './institutions';

export {
  CHART_COLORS,
  CATEGORY_CHART_COLORS,
  HEATMAP_COLORS,
} from './chartColors';

export {
  BREAKPOINTS,
  MEDIA_QUERIES,
} from './breakpoints';
export type { Breakpoint } from './breakpoints';

export { THEME } from './theme';

// その他の定数
export const MAX_RANKING_ITEMS = 10;
export const DEFAULT_PAGE_SIZE = 20;
export const HIGH_EXPENSE_THRESHOLD = 10000;
```

## 禁止事項

1. **ロジックの記述**: 定数とヘルパー関数のみ
2. **可変値**: 定数は不変（as const 必須）
3. **環境依存値**: 環境変数は .env で管理
4. **コンポーネント固有の値**: コンポーネント内で定義

## 使用例

```typescript
import {
  CATEGORIES,
  getCategoryColor,
  CHART_COLORS,
  MAX_RANKING_ITEMS,
} from '@/constants';

// チャートで使用
<Line stroke={CHART_COLORS.income} />

// カテゴリ色を取得
const color = getCategoryColor('食費');  // → '#F59E0B'

// ランキング件数
const ranking = calcRanking(data, MAX_RANKING_ITEMS);
```
