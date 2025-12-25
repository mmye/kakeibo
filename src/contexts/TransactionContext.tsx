import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Transaction } from '@/types';
import { loadTransactions } from '@/services';

type TransactionContextValue = {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
};

const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadTransactions();
      setTransactions(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <TransactionContext.Provider value={{ transactions, isLoading, error, reload: load }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext(): TransactionContextValue {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within TransactionProvider');
  }
  return context;
}
