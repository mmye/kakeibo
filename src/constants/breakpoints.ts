/**
 * レスポンシブブレークポイント定義
 * Tailwind CSSのデフォルト値に準拠
 * @see doc/design_theme.md レスポンシブブレークポイント
 */

export type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * ブレークポイント（ピクセル値）
 * - sm: 640px（Mobile上限）
 * - md: 768px（Tablet開始）
 * - lg: 1024px（Desktop開始）
 * - xl: 1280px（Wide開始）
 * - 2xl: 1536px（超ワイド）
 */
export const BREAKPOINTS: Record<BreakpointKey, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * 画面幅が指定したブレークポイント以上かを判定
 * @param width 画面幅（ピクセル）
 * @param breakpoint ブレークポイントキー
 * @returns 指定したブレークポイント以上であればtrue
 */
export function isBreakpoint(width: number, breakpoint: BreakpointKey): boolean {
  return width >= BREAKPOINTS[breakpoint];
}

/**
 * 現在のブレークポイントを取得
 * @param width 画面幅（ピクセル）
 * @returns 現在のブレークポイントキー
 */
export function getCurrentBreakpoint(width: number): BreakpointKey | null {
  if (width >= BREAKPOINTS['2xl']) {
    return '2xl';
  }
  if (width >= BREAKPOINTS.xl) {
    return 'xl';
  }
  if (width >= BREAKPOINTS.lg) {
    return 'lg';
  }
  if (width >= BREAKPOINTS.md) {
    return 'md';
  }
  if (width >= BREAKPOINTS.sm) {
    return 'sm';
  }
  return null; // Mobile (< 640px)
}
