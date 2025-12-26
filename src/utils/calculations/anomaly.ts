import type { Transaction, Anomaly, AnomalyType } from '@/types';

/**
 * 同日以内を「短期間」と定義するためのミリ秒数
 */
const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * 高額とみなす閾値（円）
 */
const HIGH_AMOUNT_THRESHOLD = 10000;

/**
 * 頻度異常を検出する期間（日数）
 */
const FREQUENCY_DAYS = 7;

/**
 * 頻度異常とみなす回数
 */
const FREQUENCY_THRESHOLD = 3;

/**
 * 店舗ごとの平均支出額を計算
 */
function calcAverageByDescription(
  transactions: Transaction[]
): Map<string, { average: number; count: number }> {
  const grouped = new Map<string, number[]>();

  transactions.forEach((t) => {
    if (t.amount >= 0) {
      return;
    } // 支出のみ対象
    const amounts = grouped.get(t.description) || [];
    amounts.push(Math.abs(t.amount));
    grouped.set(t.description, amounts);
  });

  const averages = new Map<string, { average: number; count: number }>();
  grouped.forEach((amounts, description) => {
    const sum = amounts.reduce((a, b) => a + b, 0);
    averages.set(description, {
      average: sum / amounts.length,
      count: amounts.length,
    });
  });

  return averages;
}

/**
 * 高額異常を検出
 * 同じ店舗での通常支出の3倍以上
 */
function detectHighAmount(
  transactions: Transaction[],
  averages: Map<string, { average: number; count: number }>
): Anomaly[] {
  const anomalies: Anomaly[] = [];

  transactions.forEach((t) => {
    if (t.amount >= 0) {
      return;
    } // 支出のみ対象
    const absAmount = Math.abs(t.amount);
    const stats = averages.get(t.description);

    // 過去データが十分にあり、3倍以上の支出
    if (stats && stats.count >= 3 && absAmount >= stats.average * 3) {
      anomalies.push({
        transactionId: t.id,
        type: 'high_amount',
        reason: `通常の約${Math.round(absAmount / stats.average)}倍の金額（平均¥${Math.round(stats.average).toLocaleString()}）`,
        severity: Math.min(5, Math.ceil(absAmount / stats.average)),
      });
    }
  });

  return anomalies;
}

/**
 * 頻度異常を検出
 * 同じ店舗で7日以内に3回以上
 */
function detectFrequent(transactions: Transaction[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const sorted = [...transactions]
    .filter((t) => t.amount < 0)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // 店舗ごとにグループ化
  const byDescription = new Map<string, Transaction[]>();
  sorted.forEach((t) => {
    const list = byDescription.get(t.description) || [];
    list.push(t);
    byDescription.set(t.description, list);
  });

  // 各店舗で頻度異常を検出
  byDescription.forEach((list) => {
    if (list.length < FREQUENCY_THRESHOLD) {
      return;
    }

    for (let i = 0; i < list.length; i++) {
      const current = list[i];
      if (!current) {
        continue;
      }

      // 7日以内の取引をカウント
      let count = 0;
      for (let j = 0; j < list.length; j++) {
        const target = list[j];
        if (!target) {
          continue;
        }
        const diff = Math.abs(current.date.getTime() - target.date.getTime());
        if (diff <= FREQUENCY_DAYS * DAY_IN_MS) {
          count++;
        }
      }

      if (count >= FREQUENCY_THRESHOLD) {
        anomalies.push({
          transactionId: current.id,
          type: 'frequent',
          reason: `${FREQUENCY_DAYS}日間で${count}回の利用`,
          severity: Math.min(5, count - 1),
        });
      }
    }
  });

  return anomalies;
}

/**
 * 新規パターン（初めての店舗での高額支出）を検出
 */
function detectNewHigh(transactions: Transaction[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const sorted = [...transactions]
    .filter((t) => t.amount < 0)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const seenDescriptions = new Set<string>();

  sorted.forEach((t) => {
    const absAmount = Math.abs(t.amount);

    // 初回かつ高額
    if (!seenDescriptions.has(t.description) && absAmount >= HIGH_AMOUNT_THRESHOLD) {
      anomalies.push({
        transactionId: t.id,
        type: 'new_high',
        reason: `初めての店舗で¥${absAmount.toLocaleString()}の支出`,
        severity: Math.min(5, Math.ceil(absAmount / HIGH_AMOUNT_THRESHOLD)),
      });
    }

    seenDescriptions.add(t.description);
  });

  return anomalies;
}

/**
 * 二重疑い（同日同額の複数取引）を検出
 */
function detectDuplicate(transactions: Transaction[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // 日付と金額でグループ化
  const grouped = new Map<string, Transaction[]>();
  transactions
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const key = `${t.date.toISOString().split('T')[0]}_${t.amount}`;
      const list = grouped.get(key) || [];
      list.push(t);
      grouped.set(key, list);
    });

  // 同日同額が2件以上
  grouped.forEach((list) => {
    if (list.length >= 2) {
      list.forEach((t) => {
        anomalies.push({
          transactionId: t.id,
          type: 'duplicate',
          reason: `同日に同額（¥${Math.abs(t.amount).toLocaleString()}）の取引が${list.length}件`,
          severity: 4,
        });
      });
    }
  });

  return anomalies;
}

/**
 * 取引データから異常を検出
 * @param transactions 取引データ
 * @returns 異常情報のMap（取引ID -> 異常リスト）
 */
export function detectAnomalies(transactions: Transaction[]): Map<string, Anomaly[]> {
  const result = new Map<string, Anomaly[]>();

  // 支出のみ対象
  const expenses = transactions.filter((t) => t.amount < 0 && t.isCalculated);

  if (expenses.length === 0) {
    return result;
  }

  // 平均計算
  const averages = calcAverageByDescription(expenses);

  // 各種異常を検出
  const allAnomalies = [
    ...detectHighAmount(expenses, averages),
    ...detectFrequent(expenses),
    ...detectNewHigh(expenses),
    ...detectDuplicate(expenses),
  ];

  // 取引IDごとにグループ化
  allAnomalies.forEach((anomaly) => {
    const list = result.get(anomaly.transactionId) || [];
    // 重複を避ける
    if (!list.some((a) => a.type === anomaly.type)) {
      list.push(anomaly);
    }
    result.set(anomaly.transactionId, list);
  });

  return result;
}

/**
 * 異常の種類に対応するラベルを取得
 */
export function getAnomalyLabel(type: AnomalyType): string {
  switch (type) {
    case 'high_amount':
      return '高額';
    case 'frequent':
      return '頻度';
    case 'new_high':
      return '新規';
    case 'duplicate':
      return '重複';
  }
}
