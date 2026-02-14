import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { GameMode } from '@/consts/game';
import { MODE_NAMES, SCORE_UNITS } from '@/consts/game';
import { Card } from '@/components/Card/Card';

const SCORE_INITIAL = { scale: 0 };
const SCORE_ANIMATE = { scale: 1 };
const SCORE_TRANSITION = { duration: 0.5, ease: 'easeOut' as const };

const BAR_INITIAL = { width: 0 };
const BAR_TRANSITION = { duration: 1, ease: 'easeOut' as const };

type Props = {
  mode: GameMode;
  score: number;
  bestScore: number;
};

export function ScoreCard({ mode, score, bestScore }: Props) {
  const progress = bestScore > 0 ? Math.min((score / bestScore) * 100, 100) : 0;

  const barAnimate = useMemo(() => ({ width: `${progress}%` }), [progress]);

  return (
    <Card className="p-6 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {MODE_NAMES[mode]}
      </p>
      <motion.p
        className="my-4 text-5xl font-bold text-amber-700 dark:text-casino-gold"
        initial={SCORE_INITIAL}
        animate={SCORE_ANIMATE}
        transition={SCORE_TRANSITION}
      >
        {score}
      </motion.p>
      <p className="text-gray-600 dark:text-gray-400">{SCORE_UNITS[mode]}</p>
      {bestScore > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            {`ベスト: ${bestScore}${SCORE_UNITS[mode]}`}
          </p>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-casino-gray">
            <motion.div
              className="h-full rounded-full bg-amber-500 dark:bg-casino-gold"
              initial={BAR_INITIAL}
              animate={barAnimate}
              transition={BAR_TRANSITION}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
