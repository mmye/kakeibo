# ui/ - 汎用UIコンポーネント

## 責務

プロジェクトに依存しない、再利用可能なUIパーツを提供する。
デザインシステムの基盤となるコンポーネント群。

## 配置するコンポーネント

| コンポーネント | 責務 |
|---------------|------|
| `Button` | ボタン（Primary / Secondary / Ghost） |
| `Card` | カードコンテナ |
| `Badge` | バッジ・タグ表示 |
| `Input` | テキスト入力、Select、SearchInput |
| `Table` | テーブル構造（Header, Row, Cell） |
| `Icon` | Lucide Iconsラッパー |
| `Amount` | 金額表示（収入:緑 / 支出:赤） |
| `Trend` | 前月比インジケーター（▲▼） |
| `Skeleton` | ローディングスケルトン |

## 設計原則

### 1. プロジェクト非依存

```typescript
// Good: 汎用的なprops
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

// Bad: ビジネスドメインに依存
type ButtonProps = {
  transactionType: 'income' | 'expense';  // ← 家計簿固有の概念
};
```

### 2. Composition優先

```typescript
// Good: 子要素で構成を柔軟に
<Card>
  <Card.Header>タイトル</Card.Header>
  <Card.Body>コンテンツ</Card.Body>
</Card>

// または単純に children を受け取る
<Card title="タイトル">
  コンテンツ
</Card>
```

### 3. デザイントークンの使用

`doc/design_theme.md` で定義されたCSS変数を使用する。

```typescript
// Good: CSS変数経由
<button className="bg-primary text-on-primary rounded-md">

// Bad: ハードコードされた色
<button className="bg-[#2D6A4F] text-white rounded-[8px]">
```

### 4. バリアント設計

```typescript
const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary-light',
  secondary: 'border border-primary text-primary hover:bg-primary/10',
  ghost: 'text-primary hover:bg-primary/5',
} as const;

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants[variant], buttonSizes[size])} {...props} />
  );
}
```

## 個別コンポーネント仕様

### Amount

金額を適切な色とフォーマットで表示する。

```typescript
type AmountProps = {
  value: number;           // 金額（正:収入、負:支出）
  size?: 'sm' | 'md' | 'lg';
  showSign?: boolean;      // +/- 記号を表示するか（デフォルト: true）
};

// 使用例
<Amount value={483127} />        // → "+¥483,127" (緑)
<Amount value={-32045} />        // → "-¥32,045" (赤)
<Amount value={0} />             // → "¥0" (グレー)
```

### Trend

前月比などのトレンドを表示する。

```typescript
type TrendProps = {
  value: number;           // 変化率（0.052 = +5.2%）
  size?: 'sm' | 'md';
};

// 使用例
<Trend value={0.052} />   // → "▲ 5.2%" (緑)
<Trend value={-0.123} />  // → "▼ 12.3%" (赤)
```

### Icon

Lucide Iconsのラッパー。カテゴリアイコンも提供。

```typescript
import { Utensils, Train, Smartphone } from 'lucide-react';

type IconProps = {
  name: IconName;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

// カテゴリ専用
type CategoryIconProps = {
  category: string;  // "食費", "交通費" など
  size?: 'sm' | 'md' | 'lg';
};
```

## アクセシビリティ

### 必須対応

1. **キーボード操作**: フォーカス可能な要素は Tab で到達可能に
2. **フォーカスリング**: `:focus-visible` でフォーカス状態を明示
3. **適切なrole**: ボタンは `<button>`、リンクは `<a>` を使用
4. **ラベル**: アイコンのみのボタンには `aria-label` を付与

```typescript
// Good
<button aria-label="検索">
  <Icon name="search" />
</button>

// Bad
<div onClick={handleClick}>  // ← divをボタンとして使わない
  <Icon name="search" />
</div>
```

### 色のコントラスト

- テキストと背景のコントラスト比: 4.5:1 以上
- design_theme.md の色はこの基準を満たしている

## テスト観点

```typescript
describe('Button', () => {
  // 表示
  it('childrenを表示する');
  it('variant="secondary"で枠線スタイルになる');

  // インタラクション
  it('クリックでonClickが呼ばれる');
  it('disabled時はクリック不可');

  // アクセシビリティ
  it('button roleを持つ');
  it('disabledがaria-disabledに反映される');
});

describe('Amount', () => {
  it('正の値を緑色で表示する');
  it('負の値を赤色で表示する');
  it('0をグレーで表示する');
  it('カンマ区切りでフォーマットされる');
});
```

## 禁止事項

1. **ビジネスロジックの記述**: フォーマット以外の計算はしない
2. **外部状態への依存**: Context や グローバル状態を参照しない
3. **非同期処理**: データフェッチ等は行わない
4. **他のui/コンポーネントへの過度な依存**: 循環参照を避ける
