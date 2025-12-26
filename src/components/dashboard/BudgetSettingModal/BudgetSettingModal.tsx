import { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useBudgetContext } from '@/contexts';
import { cn } from '@/utils';

type BudgetSettingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * 予算設定モーダル
 * 月間予算を設定し、LocalStorageに保存
 */
export function BudgetSettingModal({ isOpen, onClose }: BudgetSettingModalProps) {
  const { budget, setMonthlyBudget, clearBudgets } = useBudgetContext();
  const [inputValue, setInputValue] = useState('');

  // モーダルが開いたときに現在の予算値を設定
  useEffect(() => {
    if (isOpen) {
      setInputValue(budget.monthlyBudget?.toString() ?? '');
    }
  }, [isOpen, budget.monthlyBudget]);

  const handleSave = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value) && value > 0) {
      setMonthlyBudget(value);
      onClose();
    }
  };

  const handleClear = () => {
    clearBudgets();
    setInputValue('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* モーダル本体 */}
      <div
        className={cn(
          'relative bg-surface rounded-xl shadow-xl p-6 w-full max-w-md mx-4',
          'animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">予算設定</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-border/50 transition-colors"
            aria-label="閉じる"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* 予算入力 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              月間予算（円）
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                ¥
              </span>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="例: 300000"
                className="pl-8 text-right"
                min={0}
                autoFocus
              />
            </div>
            <p className="mt-2 text-xs text-text-tertiary">
              月間の支出予算を設定すると、進捗バーで使用状況が確認できます
            </p>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" onClick={handleClear} className="flex-1">
            リセット
          </Button>
          <Button onClick={handleSave} className="flex-1">
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}
