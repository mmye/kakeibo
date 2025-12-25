import { useRanking } from '@/hooks';
import { Card, Amount, Badge, CategoryIcon } from '@/components/ui';
import { formatPercentage } from '@/utils/formatters';

type RankingListProps = {
  limit?: number;
};

export function RankingList({ limit = 10 }: RankingListProps) {
  const ranking = useRanking(limit);

  return (
    <Card title="支出ランキング TOP10">
      <div className="space-y-3">
        {ranking.map((item) => (
          <div key={item.subcategory} className="flex items-center gap-3">
            <Badge variant="default" size="sm">
              {item.rank}
            </Badge>
            <CategoryIcon category={item.category} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{item.subcategory}</div>
              <div className="text-xs text-text-secondary">{item.category}</div>
            </div>
            <div className="text-right">
              <Amount value={-item.amount} size="sm" />
              <div className="text-xs text-text-secondary">{formatPercentage(item.percentage)}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
