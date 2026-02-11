import { memo } from 'react';
import { motion } from 'framer-motion';

const CONFETTI_COUNT = 50;
const FALL_DISTANCE = 800;

const COLORS = ['#FFD700', '#FFA500', '#FF6347', '#4169E1'] as const;

const CONFETTI_ITEMS = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
  const xOffset = (Math.random() - 0.5) * 200;
  const rotation = 360 * (Math.random() > 0.5 ? 1 : -1);
  const duration = 2 + Math.random() * 2;
  const delay = Math.random() * 0.5;

  return {
    id: i,
    style: {
      backgroundColor: COLORS[i % COLORS.length],
      left: `${Math.random() * 100}%`,
      top: -20,
    },
    animate: {
      y: [0, FALL_DISTANCE],
      x: [0, xOffset],
      rotate: [0, rotation],
      opacity: [1, 1, 0],
    },
    transition: {
      duration,
      ease: 'easeOut' as const,
      delay,
    },
  };
});

export const ConfettiEffect = memo(function ConfettiEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {CONFETTI_ITEMS.map((item) => (
        <motion.div
          key={item.id}
          className="absolute h-2 w-2 rounded-full"
          style={item.style}
          animate={item.animate}
          transition={item.transition}
        />
      ))}
    </div>
  );
});
