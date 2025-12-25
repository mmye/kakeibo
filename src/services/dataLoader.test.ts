import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadTSV } from './dataLoader';
import { DataLoadError } from '@/schemas';

describe('loadTSV', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('正常系', () => {
    it('TSVファイルを読み込んで文字列を返す', async () => {
      const mockTSV = '計算対象\t日付\t内容\n1\t2025/12/25\tテスト';
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockTSV),
      });

      const result = await loadTSV();

      expect(result).toBe(mockTSV);
      expect(fetch).toHaveBeenCalledWith('/data/data.tsv');
    });
  });

  describe('異常系', () => {
    it('HTTP 404エラーでDataLoadErrorをスロー', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(loadTSV()).rejects.toThrow(DataLoadError);
      await expect(loadTSV()).rejects.toThrow('HTTP error: 404');
    });

    it('HTTP 500エラーでDataLoadErrorをスロー', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(loadTSV()).rejects.toThrow(DataLoadError);
      await expect(loadTSV()).rejects.toThrow('HTTP error: 500');
    });

    it('ネットワークエラーでDataLoadErrorをスロー', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(loadTSV()).rejects.toThrow(DataLoadError);
      await expect(loadTSV()).rejects.toThrow('Failed to load TSV file');
    });

    it('ネットワークエラー時にcauseが設定される', async () => {
      const networkError = new Error('Network error');
      global.fetch = vi.fn().mockRejectedValue(networkError);

      try {
        await loadTSV();
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(DataLoadError);
        expect((error as DataLoadError).cause).toBe(networkError);
      }
    });
  });
});
