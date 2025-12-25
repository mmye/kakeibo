/**
 * 月別推移チャート用データ
 */
export type MonthlyTrendData = {
  /** 月 ("1月", "2月", ...) */
  month: string;
  /** 収入合計 */
  income: number;
  /** 支出合計 */
  expense: number;
  /** 収支 */
  balance: number;
};

/**
 * 円グラフ用データ
 */
export type PieChartData = {
  /** 項目名 */
  name: string;
  /** 値 */
  value: number;
  /** 表示色 */
  color: string;
};

/**
 * 棒グラフ用データ
 */
export type BarChartData = {
  /** ラベル */
  label: string;
  /** 値 */
  value: number;
  /** 表示色（オプション） */
  color?: string;
};

/**
 * ヒートマップ用データ
 */
export type HeatmapData = {
  /** 月 */
  month: string;
  /** カテゴリ */
  category: string;
  /** 値 */
  value: number;
  /** 強度（0-1の正規化値） */
  intensity: number;
};
