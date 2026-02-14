import { memo } from 'react';

type Props = {
  rank: 1 | 2 | 3;
};

const RANK_STYLES = {
  1: 'bg-gradient-to-br from-casino-gold to-casino-lightGold text-casino-black shadow-glow-gold',
  2: 'bg-gradient-to-br from-gray-300 to-gray-100 text-gray-800',
  3: 'bg-gradient-to-br from-amber-700 to-amber-500 text-white',
} as const;

export const RankBadge = memo(function RankBadge({ rank }: Props) {
  return (
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${RANK_STYLES[rank]}`}
    >
      {rank}
    </div>
  );
});
