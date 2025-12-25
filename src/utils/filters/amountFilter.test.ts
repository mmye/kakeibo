import { describe, it, expect } from 'vitest';
import { filterByAmountRange, filterExpenses, filterIncomes } from './amountFilter';
import type { Transaction } from '@/types';

// テスト用のTransaction作成ヘルパー
function createTransaction(amount: number): Transaction {
  return {
    id: 'test-id',
    date: new Date('2025-01-15'),
    description: 'テスト取引',
    amount,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  };
}

describe('filterByAmountRange', () => {
  const transactions = [
    createTransaction(-5000),
    createTransaction(-1000),
    createTransaction(0),
    createTransaction(1000),
    createTransaction(50000),
  ];

  it('最小値と最大値の範囲内を抽出する', () => {
    const result = filterByAmountRange(transactions, -2000, 2000);
    expect(result).toHaveLength(3);
    expect(result.map((t) => t.amount)).toEqual([-1000, 0, 1000]);
  });

  it('最小値のみ指定できる', () => {
    const result = filterByAmountRange(transactions, 0);
    expect(result).toHaveLength(3);
    expect(result.every((t) => t.amount >= 0)).toBe(true);
  });

  it('最大値のみ指定できる', () => {
    const result = filterByAmountRange(transactions, undefined, 0);
    expect(result).toHaveLength(3);
    expect(result.every((t) => t.amount <= 0)).toBe(true);
  });

  it('両方undefinedなら全件返す', () => {
    const result = filterByAmountRange(transactions);
    expect(result).toHaveLength(5);
  });

  it('境界値を含む', () => {
    const result = filterByAmountRange(transactions, -1000, 1000);
    expect(result.map((t) => t.amount)).toContain(-1000);
    expect(result.map((t) => t.amount)).toContain(1000);
  });

  it('該当がなければ空配列を返す', () => {
    const result = filterByAmountRange(transactions, 100000, 200000);
    expect(result).toEqual([]);
  });

  it('空配列は空配列を返す', () => {
    expect(filterByAmountRange([], -1000, 1000)).toEqual([]);
  });
});

describe('filterExpenses', () => {
  const transactions = [
    createTransaction(-5000),
    createTransaction(-1000),
    createTransaction(0),
    createTransaction(1000),
    createTransaction(50000),
  ];

  it('支出（負の金額）のみを抽出する', () => {
    const result = filterExpenses(transactions);
    expect(result).toHaveLength(2);
    result.forEach((t) => {
      expect(t.amount).toBeLessThan(0);
    });
  });

  it('支出がなければ空配列を返す', () => {
    const txs = [createTransaction(0), createTransaction(1000)];
    expect(filterExpenses(txs)).toEqual([]);
  });

  it('空配列は空配列を返す', () => {
    expect(filterExpenses([])).toEqual([]);
  });
});

describe('filterIncomes', () => {
  const transactions = [
    createTransaction(-5000),
    createTransaction(-1000),
    createTransaction(0),
    createTransaction(1000),
    createTransaction(50000),
  ];

  it('収入（正の金額）のみを抽出する', () => {
    const result = filterIncomes(transactions);
    expect(result).toHaveLength(2);
    result.forEach((t) => {
      expect(t.amount).toBeGreaterThan(0);
    });
  });

  it('収入がなければ空配列を返す', () => {
    const txs = [createTransaction(0), createTransaction(-1000)];
    expect(filterIncomes(txs)).toEqual([]);
  });

  it('空配列は空配列を返す', () => {
    expect(filterIncomes([])).toEqual([]);
  });
});
