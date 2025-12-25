import { z } from 'zod';

/**
 * TSVから読み込んだ生データのスキーマ
 */
export const RawTransactionSchema = z.object({
  計算対象: z.string(),
  日付: z.string().regex(/^\d{4}\/\d{1,2}\/\d{1,2}$/, '日付形式が不正です'),
  内容: z.string(),
  '金額（円）': z.string().regex(/^-?\d+$/, '金額は整数である必要があります'),
  保有金融機関: z.string(),
  大項目: z.string(),
  中項目: z.string(),
  メモ: z.string().optional().default(''),
  振替: z.string(),
  ID: z.string(),
});

/**
 * 生データ型（スキーマから推論）
 */
export type RawTransaction = z.infer<typeof RawTransactionSchema>;

/**
 * 変換後のトランザクションスキーマ
 */
export const TransactionSchema = z.object({
  id: z.string().min(1),
  date: z.date(),
  description: z.string(),
  amount: z.number().int(),
  institution: z.string(),
  category: z.string(),
  subcategory: z.string(),
  memo: z.string(),
  isTransfer: z.boolean(),
  isCalculated: z.boolean(),
});

/**
 * トランザクション型（スキーマから推論）
 */
export type Transaction = z.infer<typeof TransactionSchema>;

/**
 * トランザクション配列スキーマ
 */
export const TransactionsSchema = z.array(TransactionSchema);
