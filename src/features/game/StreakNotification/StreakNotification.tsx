import { motion, AnimatePresence } from 'framer-motion';

const STREAK_MESSAGES = {
  5: '🔥 Hot Streak!',
  10: '⚡ Incredible!',
  15: '🌟 Legendary!',
  20: '👑 Unstoppable!',
} as const;

const STREAK_THRESHOLDS = Object.keys(STREAK_MESSAGES).map(Number);

const ENTER_ANIMATE = { opacity: 1, y: 0, scale: 1 };
const EXIT_ANIMATE = { opacity: 0, y: -20, scale: 0.8 };
const INITIAL_ANIMATE = { opacity: 0, y: 20, scale: 0.8 };
const NOTIFICATION_TRANSITION = { duration: 0.5 };

type Props = {
  consecutiveCorrect: number;
};

export function StreakNotification({ consecutiveCorrect }: Props) {
  const threshold = STREAK_THRESHOLDS.findLast((t) => consecutiveCorrect >= t);

  const message = threshold
    ? STREAK_MESSAGES[threshold as keyof typeof STREAK_MESSAGES]
    : null;

  return (
    <AnimatePresence>
      {!!message && (
        <motion.div
          key={threshold}
          className="py-2 text-center text-lg font-bold text-casino-lightGold"
          initial={INITIAL_ANIMATE}
          animate={ENTER_ANIMATE}
          exit={EXIT_ANIMATE}
          transition={NOTIFICATION_TRANSITION}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
