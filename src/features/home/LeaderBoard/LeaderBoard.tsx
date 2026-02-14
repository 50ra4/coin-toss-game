import type { TopScoreItem } from '@/features/storage/storage.schema';
import { Card } from '@/components/Card/Card';
import { Icon } from '@/components/Icon/Icon';
import { RankBadge } from '@/components/RankBadge/RankBadge';

type Props = {
  topScores: {
    tenRounds: TopScoreItem[];
    survival: TopScoreItem[];
  };
};

export function LeaderBoard({ topScores }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 flex items-center justify-center gap-2 text-center font-display text-xl font-semibold text-amber-700 dark:text-casino-gold">
        <Icon name="trophy" filled size={24} />
        Your Best Records
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ScoreList
          title="10回モード"
          scores={topScores.tenRounds}
          unit="回正解"
        />
        <ScoreList
          title="サバイバル"
          scores={topScores.survival}
          unit="連続正解"
        />
      </div>
    </div>
  );
}

type ScoreListProps = {
  title: string;
  scores: TopScoreItem[];
  unit: string;
};

function ScoreList({ title, scores, unit }: ScoreListProps) {
  return (
    <Card className="p-4">
      <h3 className="mb-2 font-bold text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      {!scores.length ? (
        <p className="text-sm text-gray-500">記録なし</p>
      ) : (
        <ul className="space-y-1">
          {scores.map((item, index) => {
            const rank = (index + 1) as 1 | 2 | 3;
            return (
              <li
                key={`${item.score}-${index}`}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <RankBadge rank={rank} />
                {`${item.score}${unit}`}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
