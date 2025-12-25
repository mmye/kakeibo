import { IncomeCard } from './IncomeCard';
import { ExpenseCard } from './ExpenseCard';
import { BalanceCard } from './BalanceCard';

/**
 * サマリーカード群
 * 収入・支出・収支の3枚のカードを表示
 */
export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <IncomeCard />
      <ExpenseCard />
      <BalanceCard />
    </div>
  );
}
