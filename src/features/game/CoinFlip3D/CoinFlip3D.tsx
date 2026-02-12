import { motion } from 'framer-motion';
import type { CoinSide } from '@/consts/game';

const FLIP_ANIMATE = {
  rotateY: [0, 1800],
  scale: [1, 1.2, 1],
};

const FLIP_TRANSITION = {
  duration: 2,
  ease: 'easeInOut' as const,
};

const IDLE_STYLE =
  'flex h-28 w-28 items-center justify-center rounded-full text-5xl';

type Props = {
  result: CoinSide | null;
  isFlipping: boolean;
};

export function CoinFlip3D({ result, isFlipping }: Props) {
  const face = result === 'heads' ? '🌟' : result === 'tails' ? '🌙' : '🪙';

  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        className={`${IDLE_STYLE} bg-gold-gradient shadow-glow-gold`}
        animate={isFlipping ? FLIP_ANIMATE : undefined}
        transition={isFlipping ? FLIP_TRANSITION : undefined}
      >
        {face}
      </motion.div>
    </div>
  );
}
