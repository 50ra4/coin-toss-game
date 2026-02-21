import { memo } from 'react';
import { motion } from 'framer-motion';
import { MonetizationOnIcon } from '@/components/Icon/MonetizationOnIcon';

const COIN_ROTATE = {
  rotateY: [0, 1800, 3600],
  scale: [1, 1.15, 1],
};

const COIN_TRANSITION = {
  duration: 3.5,
  ease: 'easeInOut' as const,
  repeat: Infinity,
};

export const PageLoader = memo(function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light-gradient dark:bg-casino-gradient">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={COIN_ROTATE}
          transition={COIN_TRANSITION}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400"
          style={{
            perspective: 1000,
          }}
        >
          <MonetizationOnIcon className="size-10 text-white" />
        </motion.div>
        <p className="text-sm text-amber-700 dark:text-casino-gold">
          読み込み中...
        </p>
      </div>
    </div>
  );
});
