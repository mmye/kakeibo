# components/ - コンポーネント層

## 責務

UIの表示とユーザーインタラクションを担当する。
ビジネスロジックは持たず、propsで受け取ったデータを表示する。

## ディレクトリ構成

```
components/
├── ui/         # 汎用UIパーツ（プロジェクト非依存）
├── charts/     # Rechartsベースのチャート
├── dashboard/  # ダッシュボード固有の複合コンポーネント
└── layout/     # ページ構造・レイアウト
```

## コンポーネント設計原則

### 1. 単一責任

```typescript
// Good: 1つのことだけをする
function Amount({ value }: { value: number }) {
  return <span className={value >= 0 ? 'text-income' : 'text-expense'}>
    {formatCurrency(value)}
  </span>;
}

// Bad: 複数の責任を持つ
function AmountWithFetchAndFormat({ url }) {
  const [data, setData] = useState();
  useEffect(() => { fetch(url)... }, []);  // ← データ取得はhooksの責務
  return ...;
}
```

### 2. Props設計

```typescript
// 型定義は明示的に
type CardProps = {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlighted';  // オプショナルはデフォルト値を持つ
};

// デフォルト値は分割代入で
export function Card({ title, children, variant = 'default' }: CardProps) {
  // ...
}
```

### 3. コンポーネントファイル構成

```
Button/
├── Button.tsx       # 本体
├── Button.test.tsx  # テスト
└── index.ts         # 再エクスポート
```

```typescript
// index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

### 4. スタイリング

Tailwind CSSのユーティリティクラスを直接使用する。

```typescript
// Good: Tailwindクラスを直接使用
<div className="bg-surface rounded-lg shadow-md p-6">

// Good: 条件付きクラスはcn()ヘルパーで
import { cn } from '@/utils/cn';
<div className={cn(
  'rounded-lg p-4',
  isActive && 'bg-primary text-white',
  disabled && 'opacity-50 cursor-not-allowed'
)}>

// Bad: CSS Modulesやstyled-componentsは使わない
```

### 5. イベントハンドラ

```typescript
// Good: ハンドラはpropsで受け取る
type ButtonProps = {
  onClick?: () => void;
};

// Good: イベントの加工が必要なら内部で処理
function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(e.currentTarget.value);
    }
  };
  return <input onKeyDown={handleKeyDown} />;
}

// Bad: 親に生のイベントを渡さない
onKeyDown={(e) => onKeyDown(e)}  // ← 親がe.keyを判定することになる
```

## テストの書き方

### 基本構造

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('ラベルを表示する', () => {
    render(<Button>保存</Button>);
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });

  it('クリックでonClickが呼ばれる', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>保存</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled時はクリックできない', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>保存</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### テストで確認すること

1. **表示**: 正しい内容が表示されるか
2. **インタラクション**: クリック等が正しく動作するか
3. **状態変化**: props変更で表示が変わるか
4. **エッジケース**: 空データ、境界値など

### テストで確認しないこと

- 内部実装の詳細（useState の値など）
- CSSクラス名（振る舞いに影響しない限り）
- スナップショットテスト（変更に弱い）

## 禁止事項

1. **コンポーネント内でのデータフェッチ禁止**
   - データ取得は `hooks/` または `services/` で行う

2. **グローバル状態への直接アクセス禁止**
   - Context は hooks 経由でアクセスする

3. **ビジネスロジックの記述禁止**
   - 計算ロジックは `utils/` に切り出す
   - 例外: 表示のためのシンプルな条件分岐は許容

4. **過度なprops drilling禁止**
   - 3階層以上渡すなら Context を検討

## エクスポート規則

各サブディレクトリの `index.ts` で一括エクスポートする。

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Amount } from './Amount';
// ...

// components/index.ts
export * from './ui';
export * from './charts';
export * from './dashboard';
export * from './layout';
```

使用側:
```typescript
import { Button, Card, Amount } from '@/components/ui';
import { MonthlyTrendChart } from '@/components/charts';
```
