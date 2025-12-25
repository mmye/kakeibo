type TableHeaderProps = {
  children: React.ReactNode;
};

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="bg-surface-hover">
      <tr>{children}</tr>
    </thead>
  );
}
