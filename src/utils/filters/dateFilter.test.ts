import { describe, it, expect } from 'vitest';
import { filterByMonth, filterByYear, filterByDateRange } from './dateFilter';
import type { Transaction } from '@/types';

// テスト用のTransaction作成ヘルパー
function createTransaction(date: Date): Transaction {
  return {
    id: 'test-id',
    date,
    description: 'テスト取引',
    amount: -1000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  };
}

describe('filterByMonth', () => {
  const transactions = [
    createTransaction(new Date('2025-01-15')),
    createTransaction(new Date('2025-01-20')),
    createTransaction(new Date('2025-02-10')),
    createTransaction(new Date('2025-12-25')),
  ];

  it('指定した年月のトランザクションを抽出する', () => {
    const result = filterByMonth(transactions, 2025, 1);
    expect(result).toHaveLength(2);
    result.forEach((t) => {
      expect(t.date.getFullYear()).toBe(2025);
      expect(t.date.getMonth() + 1).toBe(1);
    });
  });

  it('該当がなければ空配列を返す', () => {
    const result = filterByMonth(transactions, 2025, 6);
    expect(result).toEqual([]);
  });

  it('空配列は空配列を返す', () => {
    expect(filterByMonth([], 2025, 1)).toEqual([]);
  });
});

describe('filterByYear', () => {
  const transactions = [
    createTransaction(new Date('2024-12-31')),
    createTransaction(new Date('2025-01-01')),
    createTransaction(new Date('2025-06-15')),
    createTransaction(new Date('2026-01-01')),
  ];

  it('指定した年のトランザクションを抽出する', () => {
    const result = filterByYear(transactions, 2025);
    expect(result).toHaveLength(2);
    result.forEach((t) => {
      expect(t.date.getFullYear()).toBe(2025);
    });
  });

  it('該当がなければ空配列を返す', () => {
    const result = filterByYear(transactions, 2023);
    expect(result).toEqual([]);
  });

  it('空配列は空配列を返す', () => {
    expect(filterByYear([], 2025)).toEqual([]);
  });
});

describe('filterByDateRange', () => {
  const transactions = [
    createTransaction(new Date('2025-01-01')),
    createTransaction(new Date('2025-01-15')),
    createTransaction(new Date('2025-01-31')),
    createTransaction(new Date('2025-02-01')),
  ];

  it('指定した期間のトランザクションを抽出する', () => {
    const start = new Date('2025-01-10');
    const end = new Date('2025-01-31');
    const result = filterByDateRange(transactions, start, end);

    expect(result).toHaveLength(2);
  });

  it('境界値を含む', () => {
    const start = new Date('2025-01-15');
    const end = new Date('2025-01-31');
    const result = filterByDateRange(transactions, start, end);

    expect(result).toHaveLength(2);
    expect(result[0]!.date).toEqual(new Date('2025-01-15'));
    expect(result[1]!.date).toEqual(new Date('2025-01-31'));
  });

  it('該当がなければ空配列を返す', () => {
    const start = new Date('2025-03-01');
    const end = new Date('2025-03-31');
    const result = filterByDateRange(transactions, start, end);
    expect(result).toEqual([]);
  });

  it('空配列は空配列を返す', () => {
    expect(filterByDateRange([], new Date(), new Date())).toEqual([]);
  });
});
