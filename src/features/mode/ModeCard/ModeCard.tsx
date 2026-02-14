import type { ReactNode } from 'react';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';

type Props = {
  title: string;
  icon: ReactNode;
  description: string;
  bestScore: number | undefined;
  onSelect: () => void;
};

export function ModeCard({
  title,
  icon,
  description,
  bestScore,
  onSelect,
}: Props) {
  return (
    <Card className="flex flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 dark:border-casino-gold/20 dark:bg-casino-gold/10 dark:text-casino-gold">
        {icon}
      </div>
      <h2 className="font-display text-xl font-semibold text-amber-700 dark:text-casino-gold">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
      {!!bestScore && (
        <p className="text-sm text-gray-500">{`ベスト: ${bestScore}`}</p>
      )}
      <Button onClick={onSelect} variant="primary" className="mt-auto">
        PLAY ▶
      </Button>
    </Card>
  );
}
