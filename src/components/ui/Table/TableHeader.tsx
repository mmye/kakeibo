type TableHeaderProps = {
  children: React.ReactNode;
};

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="bg-background">
      <tr>{children}</tr>
    </thead>
  );
}
