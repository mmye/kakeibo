# 技術スタック仕様書

## 概要

家計簿ダッシュボードアプリケーションの技術スタック定義

---

## フロントエンド

### React 19

**役割**: UIフレームワーク

**選定理由**:
- コンポーネントベースの設計でダッシュボード要素を再利用可能
- Hooksによる状態管理（useState, useEffect, useMemo）
- 豊富なエコシステムとチャートライブラリとの親和性

**主要機能**:
```jsx
// Hooksを使った状態管理例
import { useState, useMemo } from 'react';

function Dashboard({ data }) {
  const [selectedMonth, setSelectedMonth] = useState('all');

  const filteredData = useMemo(() => {
    return data.filter(item =>
      selectedMonth === 'all' || item.month === selectedMonth
    );
  }, [data, selectedMonth]);

  return <div>{/* ダッシュボードコンポーネント */}</div>;
}
```

---

### Recharts

**役割**: チャートライブラリ

**選定理由**:
- React専用に設計されたD3.jsベースのライブラリ
- 宣言的なAPIでチャートを簡単に構築
- ResponsiveContainerによる自動リサイズ対応
- 豊富なチャートタイプ（Line, Bar, Pie, Area, ComposedChart）

**使用するチャートコンポーネント**:

```jsx
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ComposedChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from 'recharts';

// 月別収支推移（折れ線グラフ）
function MonthlyTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#22c55e" name="収入" />
        <Line type="monotone" dataKey="expense" stroke="#ef4444" name="支出" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// カテゴリ別支出（円グラフ）
function CategoryPieChart({ data }) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={150}
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// 複合チャート（棒グラフ + 折れ線）
function ComposedChartExample({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="expense" fill="#8884d8" name="支出" />
        <Line type="monotone" dataKey="balance" stroke="#ff7300" name="収支" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
```

---

### Tailwind CSS v4

**役割**: CSSフレームワーク

**選定理由**:
- ユーティリティファーストで迅速なスタイリング
- レスポンシブデザインの容易な実装
- ダークモード対応
- 小さなバンドルサイズ（未使用クラスの自動削除）

**使用例**:

```html
<!-- サマリーカード -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-gray-500 text-sm font-medium">月間収入</h3>
    <p class="text-2xl font-bold text-green-600">+483,127円</p>
    <span class="text-sm text-green-500">前月比 +5.2%</span>
  </div>

  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-gray-500 text-sm font-medium">月間支出</h3>
    <p class="text-2xl font-bold text-red-600">-320,450円</p>
    <span class="text-sm text-red-500">前月比 +12.3%</span>
  </div>

  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-gray-500 text-sm font-medium">収支バランス</h3>
    <p class="text-2xl font-bold text-blue-600">+162,677円</p>
  </div>
</div>

<!-- レスポンシブなチャートコンテナ -->
<div class="w-full h-96 bg-white rounded-lg shadow-md p-4">
  <!-- Rechartsチャートがここに入る -->
</div>
```

---

### TypeScript

**役割**: 型安全な開発

**選定理由**:
- データ構造の型定義による安全性
- IDEの補完機能向上
- リファクタリングの容易さ

**型定義例**:

```typescript
// 家計データの型定義
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  institution: string;
  category: string;      // 大項目
  subcategory: string;   // 中項目
  memo: string;
  isTransfer: boolean;
  isCalculated: boolean;
}

// 月別サマリーの型
interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

// カテゴリ別集計の型
interface CategorySummary {
  category: string;
  value: number;
  percentage: number;
}
```

---

## ビルドツール

### Vite

**役割**: 開発サーバー・ビルドツール

**選定理由**:
- 高速な開発サーバー起動
- HMR（Hot Module Replacement）対応
- TypeScript/React のネイティブサポート

**設定例**:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

---

## プロジェクト構成

```
kakeibo/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── charts/
│   │   │   ├── MonthlyTrendChart.tsx
│   │   │   ├── CategoryPieChart.tsx
│   │   │   ├── ExpenseBarChart.tsx
│   │   │   └── InstitutionChart.tsx
│   │   ├── TransactionTable.tsx
│   │   └── FilterPanel.tsx
│   ├── hooks/
│   │   ├── useTransactions.ts
│   │   └── useChartData.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── dataParser.ts
│   │   └── calculations.ts
│   ├── App.tsx
│   └── main.tsx
├── data.tsv
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 依存パッケージ

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.15.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
```
