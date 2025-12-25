/**
 * TSVから読み込んだ生データの型定義
 */
export type RawTransaction = {
  計算対象: string;
  日付: string;
  内容: string;
  '金額（円）': string;
  保有金融機関: string;
  大項目: string;
  中項目: string;
  メモ: string;
  振替: string;
  ID: string;
};

/**
 * 変換後のトランザクション型定義
 */
export type Transaction = {
  /** ユニークID */
  id: string;
  /** 取引日 */
  date: Date;
  /** 取引内容・説明 */
  description: string;
  /** 金額（正:収入、負:支出） */
  amount: number;
  /** 金融機関名 */
  institution: string;
  /** 大項目（カテゴリ） */
  category: string;
  /** 中項目（サブカテゴリ） */
  subcategory: string;
  /** メモ */
  memo: string;
  /** 振替フラグ */
  isTransfer: boolean;
  /** 計算対象フラグ */
  isCalculated: boolean;
};

/**
 * 取引の種別
 */
export type TransactionType = 'income' | 'expense';

/**
 * 取引の種別を判定
 * @param amount 金額
 * @returns 金額が0以上なら 'income'、負なら 'expense'
 */
export function getTransactionType(amount: number): TransactionType {
  return amount >= 0 ? 'income' : 'expense';
}

/**
 * 収入かどうかを判定
 * @param transaction 取引
 * @returns 金額が正なら true
 */
export function isIncome(transaction: Transaction): boolean {
  return transaction.amount > 0;
}

/**
 * 支出かどうかを判定
 * @param transaction 取引
 * @returns 金額が負なら true
 */
export function isExpense(transaction: Transaction): boolean {
  return transaction.amount < 0;
}

/**
 * 計算対象かどうかを判定
 * @param transaction 取引
 * @returns 計算対象フラグがtrueかつ振替でない場合 true
 */
export function isCalculated(transaction: Transaction): boolean {
  return transaction.isCalculated && !transaction.isTransfer;
}
