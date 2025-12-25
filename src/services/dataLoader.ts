import { DataLoadError } from '@/schemas';

const DATA_PATH = '/data/data.tsv';

/**
 * TSVファイルを読み込む
 * @returns TSV文字列
 * @throws DataLoadError 読み込み失敗時
 */
export async function loadTSV(): Promise<string> {
  try {
    const response = await fetch(DATA_PATH);
    if (!response.ok) {
      throw new DataLoadError(`HTTP error: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    if (error instanceof DataLoadError) {
      throw error;
    }
    throw new DataLoadError('Failed to load TSV file', error);
  }
}
