import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionTable } from './TransactionTable';
import { TransactionProvider, FilterProvider } from '@/contexts';
import * as services from '@/services';
import type { Transaction } from '@/types';

vi.mock('@/services', () => ({
  loadTransactions: vi.fn(),
}));

const mockTransactions: Transaction[] = Array.from({ length: 25 }, (_, i) => ({
  id: `test-${i + 1}`,
  date: new Date(`2025-01-${String(i + 1).padStart(2, '0')}`),
  description: `テスト取引${i + 1}`,
  amount: i % 2 === 0 ? -(i + 1) * 100 : (i + 1) * 1000,
  institution: 'テスト銀行',
  category: '食費',
  subcategory: '食料品',
  memo: '',
  isTransfer: false,
  isCalculated: true,
}));

describe('TransactionTable', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);
  });

  it('テーブルヘッダーが表示される', async () => {
    render(<TransactionTable />, { wrapper });
    expect(await screen.findByText(/日付/)).toBeInTheDocument();
    expect(screen.getByText('内容')).toBeInTheDocument();
    expect(screen.getByText('カテゴリ')).toBeInTheDocument();
    expect(screen.getByText('金融機関')).toBeInTheDocument();
    expect(screen.getByText(/金額/)).toBeInTheDocument();
  });

  it('取引明細が表示される', async () => {
    render(<TransactionTable />, { wrapper });
    // デフォルトは日付降順なのでテスト取引25が最初
    expect(await screen.findByText('テスト取引25')).toBeInTheDocument();
  });

  it('ページネーションが表示される', async () => {
    render(<TransactionTable />, { wrapper });
    await screen.findByText('テスト取引25');
    expect(screen.getByRole('button', { name: '次へ' })).toBeInTheDocument();
  });

  it('次ページボタンで次のページが表示される', async () => {
    const user = userEvent.setup();
    render(<TransactionTable />, { wrapper });
    await screen.findByText('テスト取引25');

    const nextButton = screen.getByRole('button', { name: '次へ' });
    await user.click(nextButton);

    // 2ページ目にはテスト取引5～1が表示される
    expect(await screen.findByText('テスト取引5')).toBeInTheDocument();
  });

  it('日付ヘッダークリックでソート順が変わる', async () => {
    const user = userEvent.setup();
    render(<TransactionTable />, { wrapper });
    await screen.findByText('テスト取引25');

    const dateHeader = screen.getByText(/日付/);
    await user.click(dateHeader);

    // ソート順が変更される（デフォルトはdesc、クリックでasc）
    // asc順になるとテスト取引1が最初に表示される
    expect(await screen.findByText('テスト取引1')).toBeInTheDocument();
  });
});
