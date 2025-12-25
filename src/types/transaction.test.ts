import { describe, it, expect } from 'vitest';
import { getTransactionType, isIncome, isExpense, isCalculated } from './transaction';
import type { Transaction } from './transaction';

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

describe('getTransactionType', () => {
  it('正の金額は income を返す', () => {
    expect(getTransactionType(1000)).toBe('income');
  });

  it('負の金額は expense を返す', () => {
    expect(getTransactionType(-500)).toBe('expense');
  });

  it('ゼロは income を返す', () => {
    expect(getTransactionType(0)).toBe('income');
  });
});

describe('isIncome', () => {
  it('正の金額の取引は true を返す', () => {
    const transaction = createTransaction({ amount: 50000 });
    expect(isIncome(transaction)).toBe(true);
  });

  it('負の金額の取引は false を返す', () => {
    const transaction = createTransaction({ amount: -1000 });
    expect(isIncome(transaction)).toBe(false);
  });

  it('ゼロの取引は false を返す', () => {
    const transaction = createTransaction({ amount: 0 });
    expect(isIncome(transaction)).toBe(false);
  });
});

describe('isExpense', () => {
  it('負の金額の取引は true を返す', () => {
    const transaction = createTransaction({ amount: -1000 });
    expect(isExpense(transaction)).toBe(true);
  });

  it('正の金額の取引は false を返す', () => {
    const transaction = createTransaction({ amount: 50000 });
    expect(isExpense(transaction)).toBe(false);
  });

  it('ゼロの取引は false を返す', () => {
    const transaction = createTransaction({ amount: 0 });
    expect(isExpense(transaction)).toBe(false);
  });
});

describe('isCalculated', () => {
  it('計算対象かつ振替でない取引は true を返す', () => {
    const transaction = createTransaction({
      isCalculated: true,
      isTransfer: false,
    });
    expect(isCalculated(transaction)).toBe(true);
  });

  it('計算対象でない取引は false を返す', () => {
    const transaction = createTransaction({
      isCalculated: false,
      isTransfer: false,
    });
    expect(isCalculated(transaction)).toBe(false);
  });

  it('振替の取引は false を返す', () => {
    const transaction = createTransaction({
      isCalculated: true,
      isTransfer: true,
    });
    expect(isCalculated(transaction)).toBe(false);
  });

  it('計算対象でなく振替でもある取引は false を返す', () => {
    const transaction = createTransaction({
      isCalculated: false,
      isTransfer: true,
    });
    expect(isCalculated(transaction)).toBe(false);
  });
});
