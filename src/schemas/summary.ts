import { z } from 'zod';

/**
 * 月別サマリー
 */
export const MonthlySummarySchema = z.object({
  month: z.string(),
  income: z.number().nonnegative(),
  expense: z.number().nonnegative(),
  balance: z.number(),
});

export type MonthlySummary = z.infer<typeof MonthlySummarySchema>;

/**
 * カテゴリ別サマリー
 */
export const CategorySummarySchema = z.object({
  category: z.string(),
  amount: z.number().nonnegative(),
  percentage: z.number().min(0).max(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export type CategorySummary = z.infer<typeof CategorySummarySchema>;

/**
 * 金融機関別サマリー
 */
export const InstitutionSummarySchema = z.object({
  institution: z.string(),
  amount: z.number().nonnegative(),
  percentage: z.number().min(0).max(1),
});

export type InstitutionSummary = z.infer<typeof InstitutionSummarySchema>;

/**
 * ランキング項目
 */
export const RankingItemSchema = z.object({
  rank: z.number().int().positive(),
  subcategory: z.string(),
  category: z.string(),
  amount: z.number().nonnegative(),
  percentage: z.number().min(0).max(1),
});

export type RankingItem = z.infer<typeof RankingItemSchema>;

/**
 * トレンドデータ
 */
export const TrendDataSchema = z.object({
  income: z.number(),
  expense: z.number(),
  balance: z.number(),
});

export type TrendData = z.infer<typeof TrendDataSchema>;
