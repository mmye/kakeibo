import { describe, it, expect } from 'vitest';
import {
  filterByCategory,
  filterBySubcategory,
  filterByInstitution,
  filterBySearchQuery,
} from './categoryFilter';
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

describe('filterByCategory', () => {
  const transactions = [
    createTransaction({ category: '食費' }),
    createTransaction({ category: '食費' }),
    createTransaction({ category: '交通費' }),
    createTransaction({ category: '日用品' }),
  ];

  it('指定したカテゴリのトランザクションを抽出する', () => {
    const result = filterByCategory(transactions, '食費');
    expect(result).toHaveLength(2);
    result.forEach((t) => {
      expect(t.category).toBe('食費');
    });
  });

  it('該当がなければ空配列を返す', () => {
    const result = filterByCategory(transactions, '医療費');
    expect(result).toEqual([]);
  });

  it('空配列は空配列を返す', () => {
    expect(filterByCategory([], '食費')).toEqual([]);
  });
});

describe('filterBySubcategory', () => {
  const transactions = [
    createTransaction({ subcategory: '食料品' }),
    createTransaction({ subcategory: '食料品' }),
    createTransaction({ subcategory: '外食' }),
    createTransaction({ subcategory: 'カフェ' }),
  ];

  it('指定した中項目のトランザクションを抽出する', () => {
    const result = filterBySubcategory(transactions, '食料品');
    expect(result).toHaveLength(2);
    result.forEach((t) => {
      expect(t.subcategory).toBe('食料品');
    });
  });

  it('該当がなければ空配列を返す', () => {
    const result = filterBySubcategory(transactions, 'コンビニ');
    expect(result).toEqual([]);
  });

  it('空配列は空配列を返す', () => {
    expect(filterBySubcategory([], '食料品')).toEqual([]);
  });
});

describe('filterByInstitution', () => {
  const transactions = [
    createTransaction({ institution: '三菱UFJ銀行' }),
    createTransaction({ institution: '三菱UFJ銀行' }),
    createTransaction({ institution: '楽天カード' }),
    createTransaction({ institution: 'PayPay' }),
  ];

  it('指定した金融機関のトランザクションを抽出する', () => {
    const result = filterByInstitution(transactions, '三菱UFJ銀行');
    expect(result).toHaveLength(2);
    result.forEach((t) => {
      expect(t.institution).toBe('三菱UFJ銀行');
    });
  });

  it('該当がなければ空配列を返す', () => {
    const result = filterByInstitution(transactions, 'みずほ銀行');
    expect(result).toEqual([]);
  });

  it('空配列は空配列を返す', () => {
    expect(filterByInstitution([], '三菱UFJ銀行')).toEqual([]);
  });
});

describe('filterBySearchQuery', () => {
  const transactions = [
    createTransaction({ description: 'スーパーマーケット' }),
    createTransaction({ description: 'コンビニ購入' }),
    createTransaction({ description: 'マルエツ鹿島田店' }),
    createTransaction({ description: '電車賃' }),
  ];

  it('説明に検索文字列を含むトランザクションを抽出する', () => {
    const result = filterBySearchQuery(transactions, 'マーケット');
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('スーパーマーケット');
  });

  it('大文字小文字を区別しない', () => {
    const txs = [createTransaction({ description: 'VISA CARD' })];
    const result = filterBySearchQuery(txs, 'visa');
    expect(result).toHaveLength(1);
  });

  it('部分一致で検索する', () => {
    const result = filterBySearchQuery(transactions, 'コンビニ');
    expect(result).toHaveLength(1);
  });

  it('該当がなければ空配列を返す', () => {
    const result = filterBySearchQuery(transactions, 'ガソリン');
    expect(result).toEqual([]);
  });

  it('空の検索文字列は全件返す', () => {
    const result = filterBySearchQuery(transactions, '');
    expect(result).toHaveLength(4);
  });

  it('空配列は空配列を返す', () => {
    expect(filterBySearchQuery([], 'test')).toEqual([]);
  });
});
