/**
 * パーセンテージを小数点1桁でフォーマット
 * @example formatPercentage(0.1234) → "12.3%"
 * @example formatPercentage(1) → "100.0%"
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * パーセンテージを整数でフォーマット
 * @example formatPercentageInt(0.1234) → "12%"
 */
export function formatPercentageInt(value: number): string {
  return `${Math.round(value * 100)}%`;
}
