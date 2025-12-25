import { describe, it, expect } from 'vitest';
import { CATEGORIES, getCategoryColor, getCategoryIcon } from './categories';

describe('CATEGORIES', () => {
  it('食費の定義が存在する', () => {
    const category = CATEGORIES['食費'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#F59E0B');
    expect(category?.icon).toBe('utensils');
  });

  it('日用品の定義が存在する', () => {
    const category = CATEGORIES['日用品'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#8B5CF6');
    expect(category?.icon).toBe('shopping-bag');
  });

  it('交通費の定義が存在する', () => {
    const category = CATEGORIES['交通費'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#3B82F6');
    expect(category?.icon).toBe('train');
  });

  it('通信費の定義が存在する', () => {
    const category = CATEGORIES['通信費'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#06B6D4');
    expect(category?.icon).toBe('smartphone');
  });

  it('教養・教育の定義が存在する', () => {
    const category = CATEGORIES['教養・教育'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#10B981');
    expect(category?.icon).toBe('book-open');
  });

  it('健康・医療の定義が存在する', () => {
    const category = CATEGORIES['健康・医療'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#EC4899');
    expect(category?.icon).toBe('heart-pulse');
  });

  it('衣服・美容の定義が存在する', () => {
    const category = CATEGORIES['衣服・美容'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#F97316');
    expect(category?.icon).toBe('shirt');
  });

  it('趣味・娯楽の定義が存在する', () => {
    const category = CATEGORIES['趣味・娯楽'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#6366F1');
    expect(category?.icon).toBe('gamepad-2');
  });

  it('水道・光熱費の定義が存在する', () => {
    const category = CATEGORIES['水道・光熱費'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#14B8A6');
    expect(category?.icon).toBe('zap');
  });

  it('交際費の定義が存在する', () => {
    const category = CATEGORIES['交際費'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#EF4444');
    expect(category?.icon).toBe('users');
  });

  it('その他の定義が存在する', () => {
    const category = CATEGORIES['その他'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#6B7280');
    expect(category?.icon).toBe('more-horizontal');
  });

  it('収入の定義が存在する', () => {
    const category = CATEGORIES['収入'];
    expect(category).toBeDefined();
    expect(category?.color).toBe('#10B981');
    expect(category?.icon).toBe('arrow-up-circle');
  });
});

describe('getCategoryColor', () => {
  it('存在するカテゴリの色を返す', () => {
    expect(getCategoryColor('食費')).toBe('#F59E0B');
    expect(getCategoryColor('日用品')).toBe('#8B5CF6');
    expect(getCategoryColor('交通費')).toBe('#3B82F6');
  });

  it('存在しないカテゴリはその他の色を返す', () => {
    expect(getCategoryColor('未知のカテゴリ')).toBe('#6B7280');
  });
});

describe('getCategoryIcon', () => {
  it('存在するカテゴリのアイコン名を返す', () => {
    expect(getCategoryIcon('食費')).toBe('utensils');
    expect(getCategoryIcon('日用品')).toBe('shopping-bag');
    expect(getCategoryIcon('交通費')).toBe('train');
  });

  it('存在しないカテゴリはその他のアイコンを返す', () => {
    expect(getCategoryIcon('未知のカテゴリ')).toBe('more-horizontal');
  });
});
