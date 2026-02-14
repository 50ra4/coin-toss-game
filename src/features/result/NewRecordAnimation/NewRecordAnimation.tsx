import { motion } from 'framer-motion';
import { ConfettiEffect } from '@/components/ConfettiEffect/ConfettiEffect';
import { Icon } from '@/components/Icon/Icon';

const CONTAINER_INITIAL = { scale: 0, rotate: -180 };
const CONTAINER_TRANSITION_FIRST = { duration: 1.5, ease: 'easeOut' as const };
const CONTAINER_TRANSITION_OTHER = { duration: 1, ease: 'easeOut' as const };

const CROWN_ANIMATE = { y: [0, -20, 0] };
const CROWN_TRANSITION = { repeat: 3, duration: 0.6 };

const TEXT_ANIMATE = { scale: [1, 1.2, 1] };
const TEXT_TRANSITION = { repeat: 2, duration: 0.5 };

const RANK_MESSAGES = {
  1: '自己ベスト更新！',
  2: '2位にランクイン！',
  3: '3位にランクイン！',
} as const;

type Props = {
  rank: 1 | 2 | 3;
};

export function NewRecordAnimation({ rank }: Props) {
  const isFirstPlace = rank === 1;
  const containerAnimate = {
    scale: [0, 1.5, 1],
    rotate: [0, 360, 0],
  };

  return (
    <motion.div
      className="relative py-8 text-center"
      initial={CONTAINER_INITIAL}
      animate={containerAnimate}
      transition={
        isFirstPlace ? CONTAINER_TRANSITION_FIRST : CONTAINER_TRANSITION_OTHER
      }
    >
      {isFirstPlace && <ConfettiEffect />}
      <motion.div
        className="flex justify-center text-5xl"
        animate={CROWN_ANIMATE}
        transition={CROWN_TRANSITION}
      >
        <Icon name="workspace_premium" filled size={48} />
      </motion.div>
      <motion.h2
        className="flex items-center justify-center gap-2 text-4xl font-bold text-amber-600 dark:text-casino-lightGold"
        animate={TEXT_ANIMATE}
        transition={TEXT_TRANSITION}
      >
        <Icon name="celebration" filled size={36} /> NEW RECORD!{' '}
        <Icon name="celebration" filled size={36} />
      </motion.h2>
      <p className="mt-4 text-xl">{RANK_MESSAGES[rank]}</p>
    </motion.div>
  );
}
