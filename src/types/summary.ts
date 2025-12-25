/**
 * 月別サマリー
 */
export type MonthlySummary = {
  /** 月 ("1月", "2月", ...) */
  month: string;
  /** 収入合計 */
  income: number;
  /** 支出合計（正の値） */
  expense: number;
  /** 収支（income - expense） */
  balance: number;
};

/**
 * カテゴリ別サマリー
 */
export type CategorySummary = {
  /** カテゴリ名 */
  category: string;
  /** 金額（絶対値） */
  amount: number;
  /** 全体に対する割合 (0-1) */
  percentage: number;
  /** チャート表示用の色 */
  color: string;
};

/**
 * 金融機関別サマリー
 */
export type InstitutionSummary = {
  /** 金融機関名 */
  institution: string;
  /** 支出合計 */
  amount: number;
  /** 全体に対する割合 */
  percentage: number;
};

/**
 * ランキング項目
 */
export type RankingItem = {
  /** 順位 */
  rank: number;
  /** 中項目名 */
  subcategory: string;
  /** 親カテゴリ名 */
  category: string;
  /** 金額 */
  amount: number;
  /** 全体に対する割合 */
  percentage: number;
};

/**
 * トレンドデータ（前月比）
 */
export type TrendData = {
  /** 収入の変化率 */
  income: number;
  /** 支出の変化率 */
  expense: number;
  /** 収支の変化率 */
  balance: number;
};
