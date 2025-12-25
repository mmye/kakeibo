type HeaderProps = {
  /** ページタイトル */
  title?: string;
  /** サブタイトル（オプション） */
  subtitle?: string;
};

/**
 * ページヘッダーコンポーネント
 */
export function Header({ title = '家計簿ダッシュボード', subtitle }: HeaderProps) {
  return (
    <header className="bg-primary text-white px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-primary-light text-sm mt-1">{subtitle}</p>}
      </div>
    </header>
  );
}
