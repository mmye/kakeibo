# layout/ - レイアウトコンポーネント

## 責務

ページ全体の構造とセクション配置を担当する。
グリッドシステム、ヘッダー、セクション区切りなどを提供する。

## 配置するコンポーネント

| コンポーネント | 責務 |
|---------------|------|
| `Header` | ページヘッダー（タイトル、ナビゲーション） |
| `DashboardGrid` | ダッシュボードのグリッドレイアウト |
| `Section` | セクション区切り（タイトル付きコンテナ） |

## 設計原則

### 1. レスポンシブファースト

モバイルを基準に設計し、ブレークポイントで拡張する。

```typescript
// Good: モバイルファースト
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Bad: デスクトップファースト（モバイルで崩れる）
<div className="grid grid-cols-3 sm:grid-cols-1">
```

### 2. ブレークポイントの統一

`doc/design_theme.md` で定義されたブレークポイントを使用する。

```
Mobile:  < 640px   → 1カラム
Tablet:  640-1024px → 2カラム
Desktop: 1024-1280px → 3カラム
Wide:    > 1280px  → 4カラム（サイドバー表示可）
```

### 3. Slot パターン

子要素の配置を柔軟にするため、Slot パターンを使用する。

```typescript
// DashboardGrid の使用例
<DashboardGrid>
  <DashboardGrid.Item span={3}>  {/* 3カラム分 */}
    <SummaryCards />
  </DashboardGrid.Item>

  <DashboardGrid.Item span={2}>  {/* 2カラム分 */}
    <MonthlyTrendChart />
  </DashboardGrid.Item>

  <DashboardGrid.Item>  {/* デフォルト: 1カラム */}
    <RankingList />
  </DashboardGrid.Item>
</DashboardGrid>
```

## 個別コンポーネント仕様

### Header

ページ上部に固定表示されるヘッダー。

```typescript
type HeaderProps = {
  title?: string;  // デフォルト: "家計簿ダッシュボード"
};

// 構成
┌──────────────────────────────────────────────────────┐
│  🏠 家計簿ダッシュボード              [期間: 2025年] │
└──────────────────────────────────────────────────────┘

// スタイル
// - 背景: Primary色
// - テキスト: 白
// - 高さ: 64px
// - position: sticky, top: 0
```

```typescript
export function Header({ title = '家計簿ダッシュボード' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-primary text-white h-16 flex items-center px-6 shadow-md">
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
}
```

### DashboardGrid

ダッシュボード全体のグリッドレイアウト。

```typescript
type DashboardGridProps = {
  children: React.ReactNode;
  className?: string;
};

type GridItemProps = {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;  // グリッドカラム数
  className?: string;
};

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div className={cn(
      'grid gap-6 p-6',
      'grid-cols-1',           // Mobile
      'md:grid-cols-2',        // Tablet
      'lg:grid-cols-3',        // Desktop
      'xl:grid-cols-4',        // Wide
      className
    )}>
      {children}
    </div>
  );
}

DashboardGrid.Item = function GridItem({ children, span = 1, className }: GridItemProps) {
  const spanClasses = {
    1: '',
    2: 'md:col-span-2',
    3: 'md:col-span-2 lg:col-span-3',
    4: 'md:col-span-2 lg:col-span-3 xl:col-span-4',
  };

  return (
    <div className={cn(spanClasses[span], className)}>
      {children}
    </div>
  );
};
```

### Section

セクションタイトル付きのコンテナ。

```typescript
type SectionProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;  // 右上のアクションボタン等
  className?: string;
};

// 構成
┌──────────────────────────────────────────────────────┐
│  カテゴリ別支出                        [詳細を見る →] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  （子コンテンツ）                                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

```typescript
export function Section({ title, children, action, className }: SectionProps) {
  return (
    <section className={cn('bg-surface rounded-lg shadow-md', className)}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {action}
      </div>
      <div className="p-4">
        {children}
      </div>
    </section>
  );
}
```

## ページレイアウト例

```typescript
// pages/Dashboard.tsx での使用例
export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <DashboardGrid>
          {/* サマリーカード: 全幅 */}
          <DashboardGrid.Item span={4}>
            <SummaryCards />
          </DashboardGrid.Item>

          {/* フィルター: 全幅 */}
          <DashboardGrid.Item span={4}>
            <FilterPanel />
          </DashboardGrid.Item>

          {/* 月別推移: 2カラム */}
          <DashboardGrid.Item span={2}>
            <Section title="月別収支推移">
              <MonthlyTrendChart />
            </Section>
          </DashboardGrid.Item>

          {/* カテゴリ円グラフ: 1カラム */}
          <DashboardGrid.Item>
            <Section title="カテゴリ別支出">
              <CategoryPieChart />
            </Section>
          </DashboardGrid.Item>

          {/* ランキング: 1カラム */}
          <DashboardGrid.Item>
            <Section title="支出ランキング">
              <RankingList />
            </Section>
          </DashboardGrid.Item>

          {/* 明細テーブル: 全幅 */}
          <DashboardGrid.Item span={4}>
            <Section title="取引明細">
              <TransactionTable />
            </Section>
          </DashboardGrid.Item>
        </DashboardGrid>
      </main>
    </div>
  );
}
```

## テスト観点

```typescript
describe('Header', () => {
  it('タイトルが表示される', () => {
    render(<Header title="テスト" />);
    expect(screen.getByRole('banner')).toHaveTextContent('テスト');
  });

  it('デフォルトタイトルが表示される', () => {
    render(<Header />);
    expect(screen.getByText('家計簿ダッシュボード')).toBeInTheDocument();
  });
});

describe('DashboardGrid', () => {
  it('子要素がレンダリングされる', () => {
    render(
      <DashboardGrid>
        <DashboardGrid.Item>コンテンツ1</DashboardGrid.Item>
        <DashboardGrid.Item>コンテンツ2</DashboardGrid.Item>
      </DashboardGrid>
    );
    expect(screen.getByText('コンテンツ1')).toBeInTheDocument();
    expect(screen.getByText('コンテンツ2')).toBeInTheDocument();
  });

  it('span指定でカラム幅が変わる', () => {
    render(
      <DashboardGrid>
        <DashboardGrid.Item span={2} data-testid="wide-item">
          ワイド
        </DashboardGrid.Item>
      </DashboardGrid>
    );
    expect(screen.getByTestId('wide-item')).toHaveClass('md:col-span-2');
  });
});

describe('Section', () => {
  it('タイトルと子要素が表示される', () => {
    render(
      <Section title="テストセクション">
        <p>コンテンツ</p>
      </Section>
    );
    expect(screen.getByText('テストセクション')).toBeInTheDocument();
    expect(screen.getByText('コンテンツ')).toBeInTheDocument();
  });

  it('アクションが表示される', () => {
    render(
      <Section title="テスト" action={<button>アクション</button>}>
        コンテンツ
      </Section>
    );
    expect(screen.getByRole('button', { name: 'アクション' })).toBeInTheDocument();
  });
});
```

## 禁止事項

1. **ビジネスロジックの記述**: レイアウトのみに専念
2. **データ取得**: hooks や Context への依存は最小限に
3. **固定サイズの多用**: レスポンシブを損なう固定幅/高さは避ける
4. **過度なネスト**: 3階層以上のネストは設計を見直す

## アクセシビリティ

```typescript
// ランドマーク要素を適切に使用
<header role="banner">...</header>
<main role="main">...</main>
<nav role="navigation">...</nav>

// セクションには見出しを必ず付ける
<section aria-labelledby="section-title">
  <h2 id="section-title">カテゴリ別支出</h2>
  ...
</section>
```
