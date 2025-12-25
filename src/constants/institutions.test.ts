import { describe, it, expect } from 'vitest';
import { INSTITUTIONS, getInstitutionShortName } from './institutions';

describe('INSTITUTIONS', () => {
  it('三菱UFJ銀行の定義が存在する', () => {
    const inst = INSTITUTIONS['三菱UFJ銀行'];
    expect(inst).toBeDefined();
    expect(inst?.shortName).toBe('三菱UFJ');
    expect(inst?.type).toBe('bank');
  });

  it('楽天カードの定義が存在する', () => {
    const inst = INSTITUTIONS['楽天カード'];
    expect(inst).toBeDefined();
    expect(inst?.shortName).toBe('楽天');
    expect(inst?.type).toBe('card');
  });

  it('三井住友カードの定義が存在する', () => {
    const inst = INSTITUTIONS['三井住友カード'];
    expect(inst).toBeDefined();
    expect(inst?.shortName).toBe('三井住友');
    expect(inst?.type).toBe('card');
  });

  it('PayPayの定義が存在する', () => {
    const inst = INSTITUTIONS['PayPay'];
    expect(inst).toBeDefined();
    expect(inst?.shortName).toBe('PayPay');
    expect(inst?.type).toBe('epay');
  });

  it('みずほ銀行の定義が存在する', () => {
    const inst = INSTITUTIONS['みずほ銀行'];
    expect(inst).toBeDefined();
    expect(inst?.shortName).toBe('みずほ');
    expect(inst?.type).toBe('bank');
  });

  it('現金の定義が存在する', () => {
    const inst = INSTITUTIONS['現金'];
    expect(inst).toBeDefined();
    expect(inst?.shortName).toBe('現金');
    expect(inst?.type).toBe('cash');
  });
});

describe('getInstitutionShortName', () => {
  it('存在する金融機関の短縮名を返す', () => {
    expect(getInstitutionShortName('三菱UFJ銀行')).toBe('三菱UFJ');
    expect(getInstitutionShortName('楽天カード')).toBe('楽天');
    expect(getInstitutionShortName('PayPay')).toBe('PayPay');
  });

  it('存在しない金融機関は元の名前を返す', () => {
    expect(getInstitutionShortName('未知の銀行')).toBe('未知の銀行');
  });
});
