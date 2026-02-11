import type { TopScoreItem } from '@/features/storage/storage.schema';
import { Card } from '@/components/Card/Card';

const RANK_ICONS = ['🥇', '🥈', '🥉'] as const;

type Props = {
  scores: TopScoreItem[];
  unit: string;
  newRank: number | null;
};

export function TopScoresComparison({ scores, unit, newRank }: Props) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-center font-bold text-casino-gold">
        🏆 Your Best 3
      </h3>
      {!scores.length ? (
        <p className="text-center text-sm text-gray-500">記録なし</p>
      ) : (
        <ul className="space-y-2">
          {scores.map((item, index) => {
            const rank = index + 1;
            const isNew = rank === newRank;
            return (
              <li
                key={`${item.score}-${index}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                  isNew ? 'bg-casino-gold/10 text-casino-gold' : 'text-gray-400'
                }`}
              >
                <span>{`${RANK_ICONS.at(index) ?? ''} ${rank}位`}</span>
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
