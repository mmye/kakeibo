import { describe, it, expect } from 'vitest';
import {
  calcTotal,
  calcIncome,
  calcExpense,
  calcMonthlySummary,
  calcCategorySummary,
} from './summary';
import type { Transaction } from '@/types';

// テスト用のTransaction作成ヘルパー
function createTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'test-id',
    date: new Date('2025-01-15'),
    description: 'テスト取引',
    amount: -1000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
    ...overrides,
  };
}

describe('calcTotal', () => {
  it('合計金額を計算する', () => {
    const transactions = [
      createTransaction({ amount: 1000 }),
      createTransaction({ amount: -500 }),
      createTransaction({ amount: 300 }),
    ];
    expect(calcTotal(transactions)).toBe(800);
  });

  it('空配列は0を返す', () => {
    expect(calcTotal([])).toBe(0);
  });

  it('負の値のみの配列を計算する', () => {
    const transactions = [
      createTransaction({ amount: -1000 }),
      createTransaction({ amount: -500 }),
    ];
    expect(calcTotal(transactions)).toBe(-1500);
  });
});

describe('calcIncome', () => {
  it('収入（正の金額）のみを合計する', () => {
    const transactions = [
      createTransaction({ amount: 1000 }),
      createTransaction({ amount: -500 }),
      createTransaction({ amount: 2000 }),
    ];
    expect(calcIncome(transactions)).toBe(3000);
  });

  it('収入がなければ0を返す', () => {
    const transactions = [createTransaction({ amount: -500 }), createTransaction({ amount: -300 })];
    expect(calcIncome(transactions)).toBe(0);
  });

  it('空配列は0を返す', () => {
    expect(calcIncome([])).toBe(0);
  });
});

describe('calcExpense', () => {
  it('支出（負の金額）の絶対値を合計する', () => {
    const transactions = [
      createTransaction({ amount: 1000 }),
      createTransaction({ amount: -500 }),
      createTransaction({ amount: -300 }),
    ];
    expect(calcExpense(transactions)).toBe(800);
  });

  it('支出がなければ0を返す', () => {
    const transactions = [createTransaction({ amount: 1000 }), createTransaction({ amount: 2000 })];
    expect(calcExpense(transactions)).toBe(0);
  });

  it('空配列は0を返す', () => {
    expect(calcExpense([])).toBe(0);
  });
});

describe('calcMonthlySummary', () => {
  it('月別サマリーを計算する', () => {
    const transactions = [
      createTransaction({ date: new Date('2025-01-15'), amount: 50000 }),
      createTransaction({ date: new Date('2025-01-20'), amount: -30000 }),
      createTransaction({ date: new Date('2025-02-10'), amount: 60000 }),
      createTransaction({ date: new Date('2025-02-15'), amount: -20000 }),
    ];

    const result = calcMonthlySummary(transactions);

    expect(result).toHaveLength(2);

    const jan = result.find((s) => s.month === '1月');
    expect(jan).toMatchObject({
      month: '1月',
      income: 50000,
      expense: 30000,
      balance: 20000,
    });

    const feb = result.find((s) => s.month === '2月');
    expect(feb).toMatchObject({
      month: '2月',
      income: 60000,
      expense: 20000,
      balance: 40000,
    });
  });

  it('空配列は空配列を返す', () => {
    expect(calcMonthlySummary([])).toEqual([]);
  });

  it('月順にソートされる', () => {
    const transactions = [
      createTransaction({ date: new Date('2025-03-01'), amount: 1000 }),
      createTransaction({ date: new Date('2025-01-01'), amount: 1000 }),
      createTransaction({ date: new Date('2025-02-01'), amount: 1000 }),
    ];

    const result = calcMonthlySummary(transactions);

    expect(result[0]!.month).toBe('1月');
    expect(result[1]!.month).toBe('2月');
    expect(result[2]!.month).toBe('3月');
  });
});

describe('calcCategorySummary', () => {
  it('カテゴリ別サマリーを計算する', () => {
    const transactions = [
      createTransaction({ category: '食費', amount: -3000 }),
      createTransaction({ category: '食費', amount: -2000 }),
      createTransaction({ category: '交通費', amount: -1000 }),
    ];

    const result = calcCategorySummary(transactions);

    expect(result).toHaveLength(2);

    const food = result.find((s) => s.category === '食費');
    expect(food).toBeDefined();
    expect(food?.amount).toBe(5000);
    expect(food?.percentage).toBeCloseTo(5000 / 6000, 2);

    const transport = result.find((s) => s.category === '交通費');
    expect(transport).toBeDefined();
    expect(transport?.amount).toBe(1000);
  });

  it('金額降順でソートされる', () => {
    const transactions = [
      createTransaction({ category: '交通費', amount: -1000 }),
      createTransaction({ category: '食費', amount: -5000 }),
      createTransaction({ category: '日用品', amount: -3000 }),
    ];

    const result = calcCategorySummary(transactions);

    expect(result[0]!.category).toBe('食費');
    expect(result[1]!.category).toBe('日用品');
    expect(result[2]!.category).toBe('交通費');
  });

  it('収入は含まれない（支出のみ）', () => {
    const transactions = [
      createTransaction({ category: '収入', amount: 50000 }),
      createTransaction({ category: '食費', amount: -3000 }),
    ];

    const result = calcCategorySummary(transactions);

    expect(result).toHaveLength(1);
    expect(result[0]!.category).toBe('食費');
  });

  it('空配列は空配列を返す', () => {
    expect(calcCategorySummary([])).toEqual([]);
  });
});
