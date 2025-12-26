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
 * nullの場合は前月データがないことを示す
 */
export type TrendData = {
  /** 収入の変化率（nullは前月データなし） */
  income: number | null;
  /** 支出の変化率（nullは前月データなし） */
  expense: number | null;
  /** 収支の変化率（nullは前月データなし） */
  balance: number | null;
};

/**
 * インサイトの種類
 */
export type InsightType =
  | 'category_increase'
  | 'category_decrease'
  | 'top_category'
  | 'trend_up'
  | 'trend_down';

/**
 * インサイト（自動分析コメント）
 */
export type Insight = {
  /** インサイトの種類 */
  type: InsightType;
  /** カテゴリ名（該当する場合） */
  category?: string;
  /** 金額 */
  amount: number;
  /** 前月との差額 */
  difference?: number;
  /** 変化率 (0.05 = +5%) */
  changeRate?: number;
  /** 全体に占める割合 */
  percentage?: number;
  /** 重要度（高いほど重要） */
  priority: number;
};
