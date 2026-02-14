import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon/Icon';

const STREAK_CONFIG = {
  5: { icon: 'local_fire_department', text: 'Hot Streak!' },
  10: { icon: 'bolt', text: 'Incredible!' },
  15: { icon: 'star', text: 'Legendary!' },
  20: { icon: 'workspace_premium', text: 'Unstoppable!' },
} as const;

const STREAK_THRESHOLDS = Object.keys(STREAK_CONFIG).map(Number);

const ENTER_ANIMATE = { opacity: 1, y: 0, scale: 1 };
const EXIT_ANIMATE = { opacity: 0, y: -20, scale: 0.8 };
const INITIAL_ANIMATE = { opacity: 0, y: 20, scale: 0.8 };
const NOTIFICATION_TRANSITION = { duration: 0.5 };

type Props = {
  consecutiveCorrect: number;
};

export function StreakNotification({ consecutiveCorrect }: Props) {
  const threshold = STREAK_THRESHOLDS.findLast((t) => consecutiveCorrect >= t);

  const config = threshold
    ? STREAK_CONFIG[threshold as keyof typeof STREAK_CONFIG]
    : null;

  return (
    <AnimatePresence>
      {!!config && (
        <motion.div
          key={threshold}
          className="flex items-center justify-center gap-2 py-2 text-center text-lg font-bold text-amber-600 dark:text-casino-lightGold"
          initial={INITIAL_ANIMATE}
          animate={ENTER_ANIMATE}
          exit={EXIT_ANIMATE}
          transition={NOTIFICATION_TRANSITION}
        >
          <Icon name={config.icon} filled size={24} /> {config.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
