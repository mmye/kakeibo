import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import { Select } from './Select';
import { SearchInput } from './SearchInput';

describe('Input', () => {
  describe('レンダリング', () => {
    it('inputを正しくレンダリングする', () => {
      render(<Input placeholder="入力してください" />);
      expect(screen.getByPlaceholderText('入力してください')).toBeInTheDocument();
    });

    it('ラベルを表示する', () => {
      render(<Input label="名前" />);
      expect(screen.getByText('名前')).toBeInTheDocument();
    });

    it('エラーメッセージを表示する', () => {
      render(<Input error="入力必須です" />);
      expect(screen.getByText('入力必須です')).toBeInTheDocument();
    });

    it('エラー時にボーダー色が変わる', () => {
      render(<Input error="エラー" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('border-expense');
    });
  });

  describe('インタラクション', () => {
    it('入力が正しく反映される', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.type(input, 'テスト');

      expect(input).toHaveValue('テスト');
    });
  });
});

describe('Select', () => {
  const options = [
    { value: '', label: '選択してください' },
    { value: 'food', label: '食費' },
    { value: 'transport', label: '交通費' },
  ];

  describe('レンダリング', () => {
    it('selectを正しくレンダリングする', () => {
      render(<Select options={options} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('オプションを表示する', () => {
      render(<Select options={options} />);
      expect(screen.getByText('選択してください')).toBeInTheDocument();
      expect(screen.getByText('食費')).toBeInTheDocument();
      expect(screen.getByText('交通費')).toBeInTheDocument();
    });

    it('ラベルを表示する', () => {
      render(<Select label="カテゴリ" options={options} />);
      expect(screen.getByText('カテゴリ')).toBeInTheDocument();
    });
  });

  describe('インタラクション', () => {
    it('選択が正しく反映される', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Select options={options} onChange={handleChange} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'food');

      expect(handleChange).toHaveBeenCalled();
    });
  });
});

describe('SearchInput', () => {
  describe('レンダリング', () => {
    it('inputを正しくレンダリングする', () => {
      render(<SearchInput value="" onChange={() => {}} />);
      expect(screen.getByPlaceholderText('検索...')).toBeInTheDocument();
    });

    it('カスタムプレースホルダーを表示する', () => {
      render(<SearchInput value="" onChange={() => {}} placeholder="キーワード検索" />);
      expect(screen.getByPlaceholderText('キーワード検索')).toBeInTheDocument();
    });

    it('検索アイコンが表示される', () => {
      render(<SearchInput value="" onChange={() => {}} />);
      // SVGアイコンが存在することを確認
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('インタラクション', () => {
    it('入力時にonChangeが呼ばれる', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByPlaceholderText('検索...');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalledWith('t');
      expect(handleChange).toHaveBeenCalledWith('e');
      expect(handleChange).toHaveBeenCalledWith('s');
      expect(handleChange).toHaveBeenCalledWith('t');
    });

    it('valueが正しく表示される', () => {
      render(<SearchInput value="検索ワード" onChange={() => {}} />);
      const input = screen.getByPlaceholderText('検索...');
      expect(input).toHaveValue('検索ワード');
    });
  });
});
