# Kakeibo - 家計簿ダッシュボード

## プロジェクト概要

家族で家計を見つめ直すためのダッシュボードアプリケーション。
TSVデータを読み込み、多角的な分析ビューを提供する。

## 技術スタック

- **UI**: React 19 + TypeScript
- **チャート**: Recharts
- **スタイル**: Tailwind CSS v4
- **ビルド**: Vite
- **テスト**: Vitest + React Testing Library

## アーキテクチャ原則

### シンプルなクリーンアーキテクチャ

```
UI層 → Hooks層 → Services層 → Data層
```

依存の方向は常に内側（Data層）へ向かう。ただし過剰な抽象化は行わない。

### 禁止事項

1. **過剰抽象化の禁止**
   - 1箇所でしか使わないのにインターフェースを切らない
   - 「将来のため」の抽象化をしない
   - ファクトリーパターン等は本当に必要になるまで導入しない

2. **過剰に防御的なコードの禁止**
   - 内部コードで null/undefined を過剰にチェックしない
   - TypeScriptの型システムを信頼する
   - バリデーションは境界（データ読み込み時）でのみ行う

3. **YAGNI (You Aren't Gonna Need It)**
   - 今必要な機能だけを実装する
   - 「あとで使うかも」のコードは書かない
   - 拡張ポイントは実際に拡張するときに作る

4. **DRY (Don't Repeat Yourself)**
   - 同じロジックが3回出てきたら共通化を検討
   - ただし2回までは重複を許容（早すぎる抽象化を防ぐ）
   - 見た目が似ているだけで意味が違うものは共通化しない

## TDD実践ガイド（t-wada流）

### Red-Green-Refactorサイクル

```
1. Red:    失敗するテストを1つ書く（最小限）
2. Green:  テストを通す最短のコードを書く（汚くてOK）
3. Refactor: テストが通る状態を保ちながらリファクタリング
```

### TDDの心得

- **小さく始める**: 最初のテストは最も単純なケースから
- **一度に1つ**: 複数のことを同時にテストしない
- **テストの意図を明確に**: テスト名は日本語でも良い
- **Arrange-Act-Assert**: テストの構造を統一する
- **仮実装→三角測量→明白な実装**: 段階的に本実装へ

### テストファイルの配置

```
src/components/ui/Button/
├── Button.tsx
├── Button.test.tsx  ← コンポーネントと同階層
└── index.ts
```

### テストの書き方

```typescript
// Good: 意図が明確
describe('Amount', () => {
  it('正の金額を緑色で表示する', () => {
    render(<Amount value={1000} />);
    expect(screen.getByText('+¥1,000')).toHaveClass('text-income');
  });

  it('負の金額を赤色で表示する', () => {
    render(<Amount value={-500} />);
    expect(screen.getByText('-¥500')).toHaveClass('text-expense');
  });
});

// Bad: 実装詳細に依存
it('should call setState with correct value', () => { ... });
```

## コーディング規約

### 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `SummaryCard` |
| フック | camelCase + use | `useTransactions` |
| 関数 | camelCase + 動詞 | `formatCurrency`, `calcTotal` |
| 定数 | UPPER_SNAKE_CASE | `CHART_COLORS` |
| 型 | PascalCase | `Transaction` |
| ファイル | コンポーネント: PascalCase, その他: camelCase | |

### コンポーネント設計

```typescript
// Good: Props型を明示、シンプルな構造
type AmountProps = {
  value: number;
  size?: 'sm' | 'md' | 'lg';
};

export function Amount({ value, size = 'md' }: AmountProps) {
  const formatted = formatCurrency(value);
  const colorClass = value >= 0 ? 'text-income' : 'text-expense';

  return <span className={cn(sizeClasses[size], colorClass)}>{formatted}</span>;
}
```

### 状態管理の方針

1. **ローカルステートを優先**: `useState` で済むならそれを使う
2. **リフトアップは最小限**: 必要な親までしか上げない
3. **Contextは慎重に**: フィルター状態など、本当にグローバルなものだけ

## ディレクトリ構造

詳細は @doc/directory_structure.md を参照。

```
src/
├── components/     # UIコンポーネント
│   ├── ui/         # 汎用パーツ
│   ├── charts/     # チャート
│   ├── dashboard/  # ダッシュボード固有
│   └── layout/     # レイアウト
├── hooks/          # カスタムフック
├── contexts/       # Reactコンテキスト
├── services/       # データ処理
├── utils/          # ユーティリティ
├── types/          # 型定義
├── constants/      # 定数
└── pages/          # ページ
```

各ディレクトリの責務ルールは、そのディレクトリ内の `CLAUDE.md` を参照すること。

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run test         # テスト実行（ウォッチモード）
npm run test:ui      # Vitest UI
npm run test:coverage # カバレッジ付きテスト
npm run build        # プロダクションビルド
npm run lint         # Lint実行
npm run lint:fix     # Lint自動修正
npm run format       # Prettier実行
```

## 関連ドキュメント

- @doc/dashboard_design.md - ダッシュボード要素仕様
- @doc/design_theme.md - デザインテーマ仕様
- @doc/directory_structure.md - ディレクトリ構造詳細
- @doc/tech_stack.md - 技術スタック詳細
- @doc/api_specification.md - API仕様詳細
- @doc/function_signatures.md - 関数シグネチャ詳細
- @doc/test_specification.md - テスト仕様書
