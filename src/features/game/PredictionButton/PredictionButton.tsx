import { useCallback } from 'react';
import type { CoinSide } from '@/consts/game';
import { Button } from '@/components/Button/Button';
import { Icon } from '@/components/Icon/Icon';

type Props = {
  onPredict: (side: CoinSide) => void;
  disabled: boolean;
};

export function PredictionButton({ onPredict, disabled }: Props) {
  const handleHeads = useCallback(() => {
    onPredict('heads');
  }, [onPredict]);
  const handleTails = useCallback(() => {
    onPredict('tails');
  }, [onPredict]);

  return (
    <div className="flex justify-center gap-6">
      <Button
        onClick={handleHeads}
        variant="primary"
        className="min-w-[120px] text-lg"
        disabled={disabled}
      >
        <Icon name="star" filled size={20} /> 表
      </Button>
      <Button
        onClick={handleTails}
        variant="primary"
        className="min-w-[120px] text-lg"
        disabled={disabled}
      >
        <Icon name="dark_mode" filled size={20} /> 裏
      </Button>
    </div>
  );
}
