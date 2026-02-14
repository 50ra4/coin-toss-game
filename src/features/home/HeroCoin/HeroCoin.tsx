import { memo } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon/Icon';

const ANIMATE_CONFIG = {
  rotateY: [0, 360],
  scale: [1, 1.05, 1],
};

const TRANSITION_CONFIG = {
  rotateY: { duration: 5, repeat: Infinity, ease: 'linear' as const },
  scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const },
};

export const HeroCoin = memo(function HeroCoin() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <motion.div
        className="flex h-32 w-32 items-center justify-center rounded-full bg-gold-gradient shadow-glow-gold"
        animate={ANIMATE_CONFIG}
        transition={TRANSITION_CONFIG}
      >
        <Icon name="monetization_on" filled size={64} />
      </motion.div>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        コインの行方を予想せよ
      </p>
    </div>
  );
});
