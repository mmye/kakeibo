import { useState } from 'react';
import { TrendingDown, Settings } from 'lucide-react';
import { Card, Amount, TrendIndicator, ProgressBar } from '@/components/ui';
import { useFilteredData, useTrend } from '@/hooks';
import { useBudgetContext } from '@/contexts';
import { calcExpense } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import { BudgetSettingModal } from '../BudgetSettingModal';

/**
 * 支出サマリーカード
 * 予算が設定されている場合は進捗バーを表示
 */
export function ExpenseCard() {
  const { data } = useFilteredData();
  const trend = useTrend();
  const { budget } = useBudgetContext();
  const expense = calcExpense(data);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasBudget = budget.monthlyBudget !== null && budget.monthlyBudget > 0;
  const remaining = hasBudget ? budget.monthlyBudget! - expense : 0;

  return (
    <>
      <Card title="月間支出" icon={TrendingDown} accentColor="expense" size="large" highlighted>
        <div className="flex items-start justify-between">
          <Amount value={-expense} size="xl" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-full hover:bg-border/50 transition-colors"
            aria-label="予算設定"
            title="予算設定"
          >
            <Settings size={16} className="text-text-secondary" />
          </button>
        </div>

        {hasBudget && (
          <div className="mt-3">
            <ProgressBar value={expense} max={budget.monthlyBudget!} size="md" showLabel />
            <p className="text-xs text-text-secondary mt-1">
              {remaining >= 0 ? (
                <>
                  残り予算:{' '}
                  <span className="text-income font-medium">{formatCurrency(remaining)}</span>
                </>
              ) : (
                <>
                  予算超過:{' '}
                  <span className="text-expense font-medium">{formatCurrency(-remaining)}</span>
                </>
              )}
            </p>
          </div>
        )}

        <div className="mt-3">
          <TrendIndicator value={trend.expense} positiveIsGood={false} />
        </div>
      </Card>

      <BudgetSettingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
