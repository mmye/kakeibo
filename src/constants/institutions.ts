/**
 * 金融機関定義
 */

export type InstitutionType = 'bank' | 'card' | 'epay' | 'cash' | 'other';

export type InstitutionInfo = {
  shortName: string;
  type: InstitutionType;
};

/**
 * 金融機関の定義（短縮名・種別）
 */
export const INSTITUTIONS: Record<string, InstitutionInfo> = {
  三菱UFJ銀行: { shortName: '三菱UFJ', type: 'bank' },
  みずほ銀行: { shortName: 'みずほ', type: 'bank' },
  三井住友銀行: { shortName: '三井住友', type: 'bank' },
  ゆうちょ銀行: { shortName: 'ゆうちょ', type: 'bank' },
  楽天銀行: { shortName: '楽天', type: 'bank' },
  住信SBIネット銀行: { shortName: 'SBI', type: 'bank' },
  楽天カード: { shortName: '楽天', type: 'card' },
  三井住友カード: { shortName: '三井住友', type: 'card' },
  JCBカード: { shortName: 'JCB', type: 'card' },
  アメックス: { shortName: 'AMEX', type: 'card' },
  PayPay: { shortName: 'PayPay', type: 'epay' },
  'LINE Pay': { shortName: 'LINE', type: 'epay' },
  楽天ペイ: { shortName: '楽天Pay', type: 'epay' },
  d払い: { shortName: 'd払い', type: 'epay' },
  現金: { shortName: '現金', type: 'cash' },
} as const;

/**
 * 金融機関の短縮名を取得
 * @param institution 金融機関名
 * @returns 短縮名（未定義の場合は元の名前をそのまま返す）
 */
export function getInstitutionShortName(institution: string): string {
  return INSTITUTIONS[institution]?.shortName ?? institution;
}

/**
 * 金融機関の種別を取得
 * @param institution 金融機関名
 * @returns 種別（未定義の場合は'other'）
 */
export function getInstitutionType(institution: string): InstitutionType {
  return INSTITUTIONS[institution]?.type ?? 'other';
}
