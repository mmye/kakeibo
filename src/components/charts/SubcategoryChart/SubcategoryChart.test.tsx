import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubcategoryChart } from './SubcategoryChart';
import { TransactionProvider, FilterProvider } from '@/contexts';
import * as services from '@/services';
import type { Transaction } from '@/types';

// ResizeObserverのモック
beforeEach(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

vi.mock('@/services', () => ({
  loadTransactions: vi.fn(),
}));

const mockTransactions: Transaction[] = [
  {
    id: 'test-1',
    date: new Date('2025-01-15'),
    description: '食料品',
    amount: -30000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '食料品',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-2',
    date: new Date('2025-01-20'),
    description: '外食',
    amount: -10000,
    institution: 'テスト銀行',
    category: '食費',
    subcategory: '外食',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
  {
    id: 'test-3',
    date: new Date('2025-01-25'),
    description: '雑貨',
    amount: -5000,
    institution: 'テスト銀行',
    category: '日用品',
    subcategory: '雑貨',
    memo: '',
    isTransfer: false,
    isCalculated: true,
  },
];

describe('SubcategoryChart', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransactionProvider>
      <FilterProvider>{children}</FilterProvider>
    </TransactionProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('カテゴリ名を含むタイトルを表示する', () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    render(<SubcategoryChart category="食費" />, { wrapper });

    expect(screen.getByText('食費の内訳')).toBeInTheDocument();
  });

  it('ChartContainerでラップされている', () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    const { container } = render(<SubcategoryChart category="食費" />, { wrapper });

    expect(container.querySelector('[class*="rounded"]')).toBeInTheDocument();
  });

  it('RechartsのResponsiveContainerがレンダリングされる', () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    render(<SubcategoryChart category="食費" />, { wrapper });

    const container = document.querySelector('.recharts-responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('戻るボタンをクリックするとonBackが呼ばれる', async () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);
    const onBack = vi.fn();
    const user = userEvent.setup();

    render(<SubcategoryChart category="食費" onBack={onBack} />, { wrapper });

    await user.click(screen.getByText('← 戻る'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('onBackがない場合は戻るボタンが表示されない', () => {
    vi.mocked(services.loadTransactions).mockResolvedValue(mockTransactions);

    render(<SubcategoryChart category="食費" />, { wrapper });

    expect(screen.queryByText('← 戻る')).not.toBeInTheDocument();
  });
});
