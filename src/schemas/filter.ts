import { z } from 'zod';

/**
 * フィルター状態
 */
export const FilterStateSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  month: z.union([z.number().int().min(1).max(12), z.literal('all')]),
  category: z.union([z.string().min(1), z.literal('all')]),
  institution: z.union([z.string().min(1), z.literal('all')]),
  searchQuery: z.string(),
});

export type FilterState = z.infer<typeof FilterStateSchema>;

/**
 * ソート状態
 */
export const SortStateSchema = z.object({
  column: z.enum(['date', 'amount', 'category']),
  direction: z.enum(['asc', 'desc']),
});

export type SortState = z.infer<typeof SortStateSchema>;

/**
 * ページネーション状態
 */
export const PaginationStateSchema = z.object({
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive().max(100),
});

export type PaginationState = z.infer<typeof PaginationStateSchema>;
