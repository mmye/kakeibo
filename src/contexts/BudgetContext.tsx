import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';

/**
 * 予算設定の型
 */
type BudgetState = {
  /** 月間総予算 */
  monthlyBudget: number | null;
  /** カテゴリ別予算（オプション） */
  categoryBudgets: Record<string, number>;
};

/**
 * 予算コンテキストの値
 */
type BudgetContextValue = {
  budget: BudgetState;
  setMonthlyBudget: (amount: number | null) => void;
  setCategoryBudget: (category: string, amount: number | null) => void;
  clearBudgets: () => void;
};

const STORAGE_KEY = 'kakeibo_budget';

const defaultBudget: BudgetState = {
  monthlyBudget: null,
  categoryBudgets: {},
};

/**
 * LocalStorageから予算を読み込み
 */
function loadBudgetFromStorage(): BudgetState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        monthlyBudget: parsed.monthlyBudget ?? null,
        categoryBudgets: parsed.categoryBudgets ?? {},
      };
    }
  } catch {
    // パースエラーは無視
  }
  return defaultBudget;
}

/**
 * LocalStorageに予算を保存
 */
function saveBudgetToStorage(budget: BudgetState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
  } catch {
    // ストレージエラーは無視
  }
}

const BudgetContext = createContext<BudgetContextValue | null>(null);

/**
 * 予算管理プロバイダー
 * LocalStorageに永続化
 */
export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budget, setBudget] = useState<BudgetState>(() => loadBudgetFromStorage());

  // 予算変更時にLocalStorageに保存
  useEffect(() => {
    saveBudgetToStorage(budget);
  }, [budget]);

  const setMonthlyBudget = useCallback((amount: number | null) => {
    setBudget((prev) => ({
      ...prev,
      monthlyBudget: amount,
    }));
  }, []);

  const setCategoryBudget = useCallback((category: string, amount: number | null) => {
    setBudget((prev) => {
      const newCategoryBudgets = { ...prev.categoryBudgets };
      if (amount === null) {
        delete newCategoryBudgets[category];
      } else {
        newCategoryBudgets[category] = amount;
      }
      return {
        ...prev,
        categoryBudgets: newCategoryBudgets,
      };
    });
  }, []);

  const clearBudgets = useCallback(() => {
    setBudget(defaultBudget);
  }, []);

  const value = useMemo(
    () => ({
      budget,
      setMonthlyBudget,
      setCategoryBudget,
      clearBudgets,
    }),
    [budget, setMonthlyBudget, setCategoryBudget, clearBudgets]
  );

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

/**
 * 予算コンテキストへのアクセス
 */
export function useBudgetContext(): BudgetContextValue {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgetContext must be used within BudgetProvider');
  }
  return context;
}
