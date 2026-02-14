import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon/Icon';

const CORRECT_ANIMATE = { scale: [0, 1.2, 1] };
const INCORRECT_ANIMATE = { x: [0, -10, 10, -10, 10, 0] };
const FEEDBACK_TRANSITION = { duration: 0.5 };

type Props = {
  isCorrect: boolean | null;
};

export function ResultFeedback({ isCorrect }: Props) {
  if (isCorrect === null) return null;

  return (
    <motion.div
      className="py-4 text-center"
      animate={isCorrect ? CORRECT_ANIMATE : INCORRECT_ANIMATE}
      transition={FEEDBACK_TRANSITION}
    >
      {isCorrect ? (
        <p className="flex items-center justify-center gap-2 text-2xl font-bold text-accent-success">
          <Icon name="check_circle" filled size={28} /> 正解！
        </p>
      ) : (
        <p className="flex items-center justify-center gap-2 text-2xl font-bold text-accent-error">
          <Icon name="cancel" filled size={28} /> 不正解...
        </p>
      )}
    </motion.div>
  );
}
