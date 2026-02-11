import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';

type Props = {
  title: string;
  description: string;
  bestScore: number | undefined;
  onSelect: () => void;
};

export function ModeCard({ title, description, bestScore, onSelect }: Props) {
  return (
    <Card className="flex flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover">
      <h2 className="text-xl font-bold text-casino-gold">{title}</h2>
      <p className="text-gray-400">{description}</p>
      {!!bestScore && (
        <p className="text-sm text-gray-500">
          {`ベスト: ${bestScore}`}
        </p>
      )}
      <Button onClick={onSelect} variant="primary" className="mt-auto">
        PLAY ▶
      </Button>
    </Card>
  );
}
