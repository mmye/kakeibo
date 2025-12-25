/**
 * 金額を日本円形式でフォーマット（符号付き）
 * @example formatCurrency(1234) → "+¥1,234"
 * @example formatCurrency(-5678) → "-¥5,678"
 * @example formatCurrency(0) → "¥0"
 */
export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('ja-JP');
  if (value > 0) {
    return `+¥${formatted}`;
  }
  if (value < 0) {
    return `-¥${formatted}`;
  }
  return `¥${formatted}`;
}

/**
 * 金額を日本円形式でフォーマット（符号なし）
 * @example formatAmount(1234) → "¥1,234"
 * @example formatAmount(-5678) → "¥5,678"
 */
export function formatAmount(value: number): string {
  return `¥${Math.abs(value).toLocaleString('ja-JP')}`;
}
