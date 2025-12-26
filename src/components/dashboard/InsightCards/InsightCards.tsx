import { TrendingUp, TrendingDown, PieChart, Lightbulb } from 'lucide-react';
import { useInsights } from '@/hooks';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import type { Insight } from '@/types';
import { cn } from '@/utils';

/**
 * インサイトのメッセージを生成
 */
function getInsightMessage(insight: Insight): string {
  const { type, category, amount, difference, changeRate, percentage } = insight;

  switch (type) {
    case 'category_increase':
      return `${category}が前月比 ${formatCurrency(difference!)}（${formatPercentage(changeRate!)}）増加`;
    case 'category_decrease':
      return `${category}が前月比 ${formatCurrency(Math.abs(difference!))}（${formatPercentage(Math.abs(changeRate!))}）減少`;
    case 'top_category':
      return `${category}が支出の${Math.round((percentage || 0) * 100)}%を占め、最大カテゴリです`;
    default:
      return `${category}: ${formatCurrency(amount)}`;
  }
}

/**
 * インサイトのアイコンを取得
 */
function getInsightIcon(insight: Insight) {
  switch (insight.type) {
    case 'category_increase':
      return <TrendingUp className="text-expense" size={18} />;
    case 'category_decrease':
      return <TrendingDown className="text-income" size={18} />;
    case 'top_category':
      return <PieChart className="text-primary" size={18} />;
    default:
      return <Lightbulb className="text-warning" size={18} />;
  }
}

/**
 * インサイトカード
 */
function InsightCard({ insight }: { insight: Insight }) {
  const isIncrease = insight.type === 'category_increase';
  const isDecrease = insight.type === 'category_decrease';

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border',
        isIncrease && 'bg-expense-light border-expense/20',
        isDecrease && 'bg-income-light border-income/20',
        !isIncrease && !isDecrease && 'bg-surface-hover border-border'
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{getInsightIcon(insight)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary leading-relaxed">{getInsightMessage(insight)}</p>
        {(isIncrease || isDecrease) && (
          <p className="text-xs text-text-secondary mt-1">
            今月: {formatCurrency(-insight.amount)}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * インサイトカード群
 * サマリーカードの下に表示する自動分析コメント
 */
export function InsightCards() {
  const insights = useInsights(4);

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={18} className="text-warning" />
        <h3 className="text-sm font-semibold text-text-primary">今月のインサイト</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, index) => (
          <InsightCard key={`${insight.type}-${insight.category}-${index}`} insight={insight} />
        ))}
      </div>
    </div>
  );
}
