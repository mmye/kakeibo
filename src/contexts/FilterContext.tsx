import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { FilterState } from '@/types';
import { FilterStateSchema } from '@/schemas';

const defaultFilters: FilterState = {
  year: new Date().getFullYear(),
  month: 'all',
  category: 'all',
  institution: 'all',
  searchQuery: '',
};

type FilterContextValue = {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, _setFilters] = useState<FilterState>(defaultFilters);

  const setFilters = useCallback((newFilters: FilterState) => {
    const validated = FilterStateSchema.parse(newFilters);
    _setFilters(validated);
  }, []);

  const resetFilters = useCallback(() => {
    _setFilters(defaultFilters);
  }, []);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    _setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext(): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within FilterProvider');
  }
  return context;
}
