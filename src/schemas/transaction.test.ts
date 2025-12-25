import { describe, it, expect } from 'vitest';
import { RawTransactionSchema, TransactionSchema, TransactionsSchema } from './transaction';

describe('RawTransactionSchema', () => {
  const validRawTransaction = {
    計算対象: '1',
    日付: '2025/12/25',
    内容: 'スーパーマーケット',
    '金額（円）': '-1000',
    保有金融機関: 'みずほ銀行',
    大項目: '食費',
    中項目: '食料品',
    メモ: 'テストメモ',
    振替: '0',
    ID: 'abc123',
  };

  describe('正常系', () => {
    it('有効なデータをパースする', () => {
      const result = RawTransactionSchema.safeParse(validRawTransaction);
      expect(result.success).toBe(true);
    });

    it('メモが空でも有効', () => {
      const data = { ...validRawTransaction, メモ: '' };
      const result = RawTransactionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('メモがなくてもデフォルト値で有効', () => {
      const { メモ: _, ...dataWithoutMemo } = validRawTransaction;
      const result = RawTransactionSchema.safeParse(dataWithoutMemo);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.メモ).toBe('');
      }
    });

    it('正の金額をパースする', () => {
      const data = { ...validRawTransaction, '金額（円）': '50000' };
      const result = RawTransactionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('1桁の月/日の日付をパースする', () => {
      const data = { ...validRawTransaction, 日付: '2025/1/5' };
      const result = RawTransactionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('異常系', () => {
    it('不正な日付形式でエラー', () => {
      const data = { ...validRawTransaction, 日付: '2025-12-25' };
      const result = RawTransactionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('不正な金額形式でエラー', () => {
      const data = { ...validRawTransaction, '金額（円）': '1000円' };
      const result = RawTransactionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('小数の金額でエラー', () => {
      const data = { ...validRawTransaction, '金額（円）': '1000.5' };
      const result = RawTransactionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('必須フィールドがないとエラー', () => {
      const { ID: _, ...dataWithoutId } = validRawTransaction;
      const result = RawTransactionSchema.safeParse(dataWithoutId);
      expect(result.success).toBe(false);
    });
  });
});

describe('TransactionSchema', () => {
  const validTransaction = {
    id: 'abc123',
    date: new Date('2025-12-25'),
    description: 'スーパーマーケット',
    amount: -1000,
    institution: 'みずほ銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  };

  describe('正常系', () => {
    it('有効なデータをパースする', () => {
      const result = TransactionSchema.safeParse(validTransaction);
      expect(result.success).toBe(true);
    });

    it('正の金額をパースする', () => {
      const data = { ...validTransaction, amount: 50000 };
      const result = TransactionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('ゼロの金額をパースする', () => {
      const data = { ...validTransaction, amount: 0 };
      const result = TransactionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('異常系', () => {
    it('空のIDでエラー', () => {
      const data = { ...validTransaction, id: '' };
      const result = TransactionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('小数の金額でエラー', () => {
      const data = { ...validTransaction, amount: 1000.5 };
      const result = TransactionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('文字列の日付でエラー', () => {
      const data = { ...validTransaction, date: '2025-12-25' };
      const result = TransactionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('必須フィールドがないとエラー', () => {
      const { category: _, ...dataWithoutCategory } = validTransaction;
      const result = TransactionSchema.safeParse(dataWithoutCategory);
      expect(result.success).toBe(false);
    });
  });
});

describe('TransactionsSchema', () => {
  const validTransaction = {
    id: 'abc123',
    date: new Date('2025-12-25'),
    description: 'スーパーマーケット',
    amount: -1000,
    institution: 'みずほ銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  };

  it('配列をパースする', () => {
    const result = TransactionsSchema.safeParse([validTransaction]);
    expect(result.success).toBe(true);
  });

  it('空配列をパースする', () => {
    const result = TransactionsSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it('複数のトランザクションをパースする', () => {
    const transactions = [validTransaction, { ...validTransaction, id: 'def456', amount: 50000 }];
    const result = TransactionsSchema.safeParse(transactions);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
    }
  });

  it('不正なトランザクションが含まれるとエラー', () => {
    const transactions = [validTransaction, { id: '' }];
    const result = TransactionsSchema.safeParse(transactions);
    expect(result.success).toBe(false);
  });
});
