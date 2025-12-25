import { describe, it, expect } from 'vitest';
import { CHART_COLORS, TREND_COLORS, SEMANTIC_COLORS } from './chartColors';

describe('CHART_COLORS', () => {
  it('income色が定義されている', () => {
    expect(CHART_COLORS.income).toBe('#10B981');
  });

  it('expense色が定義されている', () => {
    expect(CHART_COLORS.expense).toBe('#EF4444');
  });

  it('balance色が定義されている', () => {
    expect(CHART_COLORS.balance).toBe('#2D6A4F');
  });
});

describe('TREND_COLORS', () => {
  it('income色が定義されている', () => {
    expect(TREND_COLORS.income).toBe('#10B981');
  });

  it('expense色が定義されている', () => {
    expect(TREND_COLORS.expense).toBe('#EF4444');
  });

  it('balance色が定義されている', () => {
    expect(TREND_COLORS.balance).toBe('#2D6A4F');
  });
});

describe('SEMANTIC_COLORS', () => {
  it('income関連の色が定義されている', () => {
    expect(SEMANTIC_COLORS.income).toBe('#10B981');
    expect(SEMANTIC_COLORS.incomeLight).toBe('#D1FAE5');
  });

  it('expense関連の色が定義されている', () => {
    expect(SEMANTIC_COLORS.expense).toBe('#EF4444');
    expect(SEMANTIC_COLORS.expenseLight).toBe('#FEE2E2');
  });

  it('neutral色が定義されている', () => {
    expect(SEMANTIC_COLORS.neutral).toBe('#6B7280');
  });

  it('warning関連の色が定義されている', () => {
    expect(SEMANTIC_COLORS.warning).toBe('#D97706');
    expect(SEMANTIC_COLORS.warningLight).toBe('#FEF3C7');
  });
});
