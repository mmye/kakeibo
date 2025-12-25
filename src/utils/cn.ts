import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSのクラス名を結合・マージ
 * clsx + tailwind-merge のラッパー
 * @param inputs クラス名（条件付き含む）
 * @returns マージ済みクラス名
 * @example cn('px-4', isActive && 'bg-primary', 'py-2') → "px-4 bg-primary py-2"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
