import type { GameMode } from '@/consts/game';
import { MODE_NAMES } from '@/consts/game';

type Props = {
  mode: GameMode;
  score: number;
  currentRound: number;
  consecutiveCorrect: number;
};

export function ScoreDisplay({
  mode,
  score,
  currentRound,
  consecutiveCorrect,
}: Props) {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {MODE_NAMES[mode]}
      </p>
      <p className="text-3xl font-bold text-amber-700 dark:text-casino-gold">
        {mode === 'tenRounds'
          ? `${score} / ${currentRound - 1}`
          : `${consecutiveCorrect} 連続正解`}
      </p>
      {mode === 'tenRounds' && (
        <p className="text-sm text-gray-500">{`Round ${currentRound} / 10`}</p>
      )}
    </div>
  );
}
