import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { DataLoadError, DataParseError, ValidationError } from './errors';

describe('DataLoadError', () => {
  it('メッセージを持つ', () => {
    const error = new DataLoadError('ファイルの読み込みに失敗しました');
    expect(error.message).toBe('ファイルの読み込みに失敗しました');
  });

  it('名前がDataLoadErrorである', () => {
    const error = new DataLoadError('エラー');
    expect(error.name).toBe('DataLoadError');
  });

  it('causeを持つことができる', () => {
    const cause = new Error('Network error');
    const error = new DataLoadError('ファイルの読み込みに失敗しました', cause);
    expect(error.cause).toBe(cause);
  });

  it('causeがなくても作成できる', () => {
    const error = new DataLoadError('エラー');
    expect(error.cause).toBeUndefined();
  });

  it('Errorのインスタンスである', () => {
    const error = new DataLoadError('エラー');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('DataParseError', () => {
  it('メッセージを持つ', () => {
    const error = new DataParseError('パースに失敗しました');
    expect(error.message).toBe('パースに失敗しました');
  });

  it('名前がDataParseErrorである', () => {
    const error = new DataParseError('エラー');
    expect(error.name).toBe('DataParseError');
  });

  it('行番号を持つことができる', () => {
    const error = new DataParseError('パースに失敗しました', 42);
    expect(error.line).toBe(42);
  });

  it('行番号がなくても作成できる', () => {
    const error = new DataParseError('エラー');
    expect(error.line).toBeUndefined();
  });

  it('Errorのインスタンスである', () => {
    const error = new DataParseError('エラー');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('ValidationError', () => {
  it('メッセージを持つ', () => {
    const zodError = new z.ZodError([]);
    const error = new ValidationError('バリデーションに失敗しました', zodError);
    expect(error.message).toBe('バリデーションに失敗しました');
  });

  it('名前がValidationErrorである', () => {
    const zodError = new z.ZodError([]);
    const error = new ValidationError('エラー', zodError);
    expect(error.name).toBe('ValidationError');
  });

  it('ZodErrorを持つ', () => {
    const zodError = new z.ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['name'],
        message: 'Expected string, received number',
      },
    ]);
    const error = new ValidationError('バリデーションに失敗しました', zodError);
    expect(error.zodError).toBe(zodError);
  });

  it('issuesゲッターでZodErrorのissuesを取得できる', () => {
    const issues = [
      {
        code: 'invalid_type' as const,
        expected: 'string' as const,
        received: 'number' as const,
        path: ['name'],
        message: 'Expected string, received number',
      },
    ];
    const zodError = new z.ZodError(issues);
    const error = new ValidationError('エラー', zodError);
    expect(error.issues).toEqual(issues);
  });

  it('Errorのインスタンスである', () => {
    const zodError = new z.ZodError([]);
    const error = new ValidationError('エラー', zodError);
    expect(error).toBeInstanceOf(Error);
  });
});
