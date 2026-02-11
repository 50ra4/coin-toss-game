import type { TopScoreItem } from '@/features/storage/storage.schema';
import { Card } from '@/components/Card/Card';

const RANK_ICONS = ['🥇', '🥈', '🥉'] as const;

type Props = {
  topScores: {
    tenRounds: TopScoreItem[];
    survival: TopScoreItem[];
  };
};

export function LeaderBoard({ topScores }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-center text-xl font-bold text-casino-gold">
        🏆 Your Best Records
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ScoreList title="10回モード" scores={topScores.tenRounds} unit="回正解" />
        <ScoreList title="サバイバル" scores={topScores.survival} unit="連続正解" />
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
      <h3 className="mb-2 font-bold text-gray-300">{title}</h3>
      {!scores.length ? (
        <p className="text-sm text-gray-500">記録なし</p>
      ) : (
        <ul className="space-y-1">
          {scores.map((item, index) => (
            <li key={`${item.score}-${index}`} className="text-sm text-gray-400">
              {`${RANK_ICONS.at(index) ?? ''} ${item.score}${unit}`}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
