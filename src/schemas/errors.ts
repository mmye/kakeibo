import type { z } from 'zod';

/**
 * データ読み込みエラー
 */
export class DataLoadError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DataLoadError';
  }
}

/**
 * データパースエラー
 */
export class DataParseError extends Error {
  constructor(
    message: string,
    public readonly line?: number
  ) {
    super(message);
    this.name = 'DataParseError';
  }
}

/**
 * バリデーションエラーのラッパー
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly zodError: z.ZodError
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  get issues() {
    return this.zodError.issues;
  }
}
