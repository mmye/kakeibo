import type { Transaction, Insight } from '@/types';
import { calcExpense } from './summary';

type CategoryExpense = {
  category: string;
  currentAmount: number;
  previousAmount: number;
};

/**
 * カテゴリ別の当月・前月支出を計算
 */
function calcCategoryExpenses(
  currentTransactions: Transaction[],
  previousTransactions: Transaction[]
): CategoryExpense[] {
  const currentByCategory = new Map<string, number>();
  const previousByCategory = new Map<string, number>();

  // 当月のカテゴリ別支出
  currentTransactions
    .filter((t) => t.amount < 0 && t.category !== '収入')
    .forEach((t) => {
      const current = currentByCategory.get(t.category) || 0;
      currentByCategory.set(t.category, current + Math.abs(t.amount));
    });

  // 前月のカテゴリ別支出
  previousTransactions
    .filter((t) => t.amount < 0 && t.category !== '収入')
    .forEach((t) => {
      const current = previousByCategory.get(t.category) || 0;
      previousByCategory.set(t.category, current + Math.abs(t.amount));
    });

  // 全カテゴリを統合
  const allCategories = new Set([...currentByCategory.keys(), ...previousByCategory.keys()]);

  return Array.from(allCategories).map((category) => ({
    category,
    currentAmount: currentByCategory.get(category) || 0,
    previousAmount: previousByCategory.get(category) || 0,
  }));
}

/**
 * インサイトを生成
 */
export function calcInsights(
  currentTransactions: Transaction[],
  previousTransactions: Transaction[],
  limit: number = 5
): Insight[] {
  const insights: Insight[] = [];

  // 前月データがない場合は空を返す
  if (previousTransactions.length === 0) {
    return [];
  }

  const totalCurrentExpense = calcExpense(currentTransactions);
  const categoryExpenses = calcCategoryExpenses(currentTransactions, previousTransactions);

  // カテゴリ別の変化を分析
  for (const { category, currentAmount, previousAmount } of categoryExpenses) {
    const difference = currentAmount - previousAmount;
    const changeRate = previousAmount > 0 ? difference / previousAmount : currentAmount > 0 ? 1 : 0;
    const percentage = totalCurrentExpense > 0 ? currentAmount / totalCurrentExpense : 0;

    // 有意な変化（10%以上または5000円以上の変化）のみ
    const isSignificant = Math.abs(changeRate) >= 0.1 || Math.abs(difference) >= 5000;

    if (isSignificant && currentAmount > 0) {
      if (difference > 0) {
        // 増加
        insights.push({
          type: 'category_increase',
          category,
          amount: currentAmount,
          difference,
          changeRate,
          percentage,
          priority: Math.abs(difference) + Math.abs(changeRate) * 10000,
        });
      } else if (difference < 0) {
        // 減少
        insights.push({
          type: 'category_decrease',
          category,
          amount: currentAmount,
          difference,
          changeRate,
          percentage,
          priority: Math.abs(difference) + Math.abs(changeRate) * 10000,
        });
      }
    }
  }

  // 最大カテゴリを追加（30%以上占める場合）
  const topCategory = categoryExpenses
    .filter((c) => c.currentAmount > 0)
    .sort((a, b) => b.currentAmount - a.currentAmount)[0];

  if (topCategory) {
    const percentage =
      totalCurrentExpense > 0 ? topCategory.currentAmount / totalCurrentExpense : 0;
    if (percentage >= 0.25) {
      insights.push({
        type: 'top_category',
        category: topCategory.category,
        amount: topCategory.currentAmount,
        percentage,
        priority: percentage * 10000,
      });
    }
  }

  // 重要度順にソートして上位を返す
  return insights.sort((a, b) => b.priority - a.priority).slice(0, limit);
}
