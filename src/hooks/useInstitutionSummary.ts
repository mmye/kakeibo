import { useMemo } from 'react';
import { useFilteredData } from './useFilteredData';
import type { InstitutionSummary } from '@/types';

/**
 * 金融機関別サマリーを計算
 * @returns 金融機関別サマリー配列（金額降順）
 */
export function useInstitutionSummary(): InstitutionSummary[] {
  const { data } = useFilteredData();

  return useMemo(() => {
    // 支出のみを対象
    const expenses = data.filter((t) => t.amount < 0);

    if (expenses.length === 0) {
      return [];
    }

    const total = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // 金融機関別に集計
    const byInstitution = new Map<string, number>();
    for (const t of expenses) {
      const current = byInstitution.get(t.institution) ?? 0;
      byInstitution.set(t.institution, current + Math.abs(t.amount));
    }

    // 配列に変換してソート
    return Array.from(byInstitution.entries())
      .map(([institution, amount]) => ({
        institution,
        amount,
        percentage: total > 0 ? amount / total : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [data]);
}
