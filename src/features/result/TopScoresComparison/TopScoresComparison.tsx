import type { TopScoreItem } from '@/features/storage/storage.schema';
import { Card } from '@/components/Card/Card';
import { Icon } from '@/components/Icon/Icon';
import { RankBadge } from '@/components/RankBadge/RankBadge';

type Props = {
  scores: TopScoreItem[];
  unit: string;
  newRank: number | null;
};

export function TopScoresComparison({ scores, unit, newRank }: Props) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 flex items-center justify-center gap-2 text-center font-bold text-amber-700 dark:text-casino-gold">
        <Icon name="trophy" filled size={20} /> Your Best 3
      </h3>
      {!scores.length ? (
        <p className="text-center text-sm text-gray-500">記録なし</p>
      ) : (
        <ul className="space-y-2">
          {scores.map((item, index) => {
            const rank = (index + 1) as 1 | 2 | 3;
            const isNew = rank === newRank;
            return (
              <li
                key={`${item.score}-${index}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                  isNew
                    ? 'bg-amber-100 text-amber-700 dark:bg-casino-gold/10 dark:text-casino-gold'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <RankBadge rank={rank} /> {rank}位
                </span>
                <span className="font-bold">
                  {`${item.score}${unit}`}
                  {isNew && ' ← NEW!'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
