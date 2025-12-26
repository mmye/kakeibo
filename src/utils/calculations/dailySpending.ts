import type { Transaction, DailySpendingData, DailySpendingResult } from '@/types';

const DAY_OF_WEEK: readonly string[] = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * 日付をYYYY-MM-DD形式に変換
 */
function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 日付から曜日を取得
 */
function getDayOfWeek(date: Date): string {
  return DAY_OF_WEEK[date.getDay()] ?? '?';
}

/**
 * 日別支出データを計算
 * @param transactions - トランザクション配列（フィルター適用済み）
 * @returns 日別支出データ
 */
export function calcDailySpending(transactions: Transaction[]): DailySpendingResult {
  // 支出のみを抽出（振替と計算対象外を除外）
  const expenses = transactions.filter((t) => t.amount < 0 && !t.isTransfer && t.isCalculated);

  if (expenses.length === 0) {
    return {
      data: [],
      categories: [],
      totalSpending: 0,
      averageDaily: 0,
      peakDay: null,
    };
  }

  // 出現するカテゴリを収集
  const categorySet = new Set<string>();
  expenses.forEach((t) => categorySet.add(t.category));
  const categories = Array.from(categorySet).sort();

  // 日別にグループ化
  const dailyMap = new Map<string, { date: Date; byCategory: Record<string, number> }>();

  for (const t of expenses) {
    const dateKey = formatDateKey(t.date);
    const amount = Math.abs(t.amount);

    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { date: t.date, byCategory: {} });
    }

    const entry = dailyMap.get(dateKey)!;
    entry.byCategory[t.category] = (entry.byCategory[t.category] || 0) + amount;
  }

  // DailySpendingData配列を作成
  const data: DailySpendingData[] = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { date: dateObj, byCategory }]) => {
      const total = Object.values(byCategory).reduce((sum, v) => sum + v, 0);
      const result: DailySpendingData = {
        date,
        dayOfWeek: getDayOfWeek(dateObj),
        total,
      };

      // カテゴリ別支出を追加（存在しないカテゴリは0）
      for (const cat of categories) {
        result[cat] = byCategory[cat] || 0;
      }

      return result;
    });

  // 統計情報を計算
  const totalSpending = data.reduce((sum, d) => sum + d.total, 0);
  const averageDaily = data.length > 0 ? totalSpending / data.length : 0;

  // 最大支出日を探す
  let peakDay: { date: string; amount: number } | null = null;
  for (const d of data) {
    if (!peakDay || d.total > peakDay.amount) {
      peakDay = { date: d.date, amount: d.total };
    }
  }

  return {
    data,
    categories,
    totalSpending,
    averageDaily,
    peakDay,
  };
}
