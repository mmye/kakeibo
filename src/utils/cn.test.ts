import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  describe('基本的なクラス結合', () => {
    it('複数のクラス名を結合する', () => {
      expect(cn('px-4', 'py-2', 'bg-white')).toBe('px-4 py-2 bg-white');
    });

    it('単一のクラス名を返す', () => {
      expect(cn('px-4')).toBe('px-4');
    });

    it('空文字列を返す（引数なし）', () => {
      expect(cn()).toBe('');
    });
  });

  describe('条件付きクラス', () => {
    it('trueの条件でクラスを含める', () => {
      const isActive = true;
      expect(cn('base', isActive && 'active')).toBe('base active');
    });

    it('falseの条件でクラスを除外する', () => {
      const isActive = false;
      expect(cn('base', isActive && 'active')).toBe('base');
    });

    it('undefinedを無視する', () => {
      expect(cn('base', undefined, 'extra')).toBe('base extra');
    });

    it('nullを無視する', () => {
      expect(cn('base', null, 'extra')).toBe('base extra');
    });
  });

  describe('Tailwindクラスのマージ', () => {
    it('パディングの競合を解決する', () => {
      expect(cn('px-2 py-1', 'p-3')).toBe('p-3');
    });

    it('背景色の競合を解決する', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('テキスト色の競合を解決する', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('後のクラスが優先される', () => {
      expect(cn('font-bold', 'font-normal')).toBe('font-normal');
    });

    it('関係ないクラスは保持される', () => {
      expect(cn('px-4 hover:bg-gray-100', 'py-2')).toBe('px-4 hover:bg-gray-100 py-2');
    });
  });

  describe('配列のサポート', () => {
    it('配列を展開する', () => {
      expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2');
    });

    it('ネストした配列を処理する', () => {
      expect(cn('base', ['nested', ['deeply-nested']])).toBe('base nested deeply-nested');
    });
  });

  describe('実際の使用例', () => {
    it('ボタンのスタイルをマージする', () => {
      const baseStyles = 'px-4 py-2 rounded font-medium';
      const variantStyles = 'bg-primary text-white';
      const userStyles = 'px-6'; // パディングを上書き

      expect(cn(baseStyles, variantStyles, userStyles)).toBe(
        'py-2 rounded font-medium bg-primary text-white px-6'
      );
    });

    it('条件付きスタイルを適用する', () => {
      const isDisabled = true;
      const isLoading = false;

      expect(
        cn('btn', isDisabled && 'opacity-50 cursor-not-allowed', isLoading && 'animate-pulse')
      ).toBe('btn opacity-50 cursor-not-allowed');
    });
  });
});
