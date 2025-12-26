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

/**
 * 日別支出チャート用データ
 * カテゴリ名をキーとした動的プロパティを持つ
 */
export type DailySpendingData = {
  /** 日付（YYYY-MM-DD形式） */
  date: string;
  /** 曜日（"月", "火", ...） */
  dayOfWeek: string;
  /** 当日合計 */
  total: number;
  /** カテゴリ別支出（動的プロパティ） */
  [category: string]: number | string;
};

/**
 * 日別支出フックの戻り値
 */
export type DailySpendingResult = {
  /** 日別支出データ（日付順） */
  data: DailySpendingData[];
  /** 出現するカテゴリ一覧 */
  categories: string[];
  /** 期間合計 */
  totalSpending: number;
  /** 日平均 */
  averageDaily: number;
  /** 最大支出日 */
  peakDay: { date: string; amount: number } | null;
};
