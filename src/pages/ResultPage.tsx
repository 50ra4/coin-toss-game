import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { SCORE_UNITS } from '@/consts/game';
import { GameResultSchema } from '@/features/result/result.schema';
import { useGameStorage } from '@/features/storage/useGameStorage';
import { getBestScore } from '@/features/storage/storageOperations';
import { NewRecordAnimation } from '@/features/result/NewRecordAnimation/NewRecordAnimation';
import { ScoreCard } from '@/features/result/ScoreCard/ScoreCard';
import { TopScoresComparison } from '@/features/result/TopScoresComparison/TopScoresComparison';
import { ShareSection } from '@/features/result/ShareSection/ShareSection';
import { MotivationMessage } from '@/features/result/MotivationMessage/MotivationMessage';
import { AdPlaceholder } from '@/components/AdPlaceholder/AdPlaceholder';
import { Button } from '@/components/Button/Button';

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useGameStorage();

  const result = useMemo(() => {
    const parsed = GameResultSchema.safeParse(location.state);
    return parsed.success ? parsed.data : null;
  }, [location.state]);

  const handleGoHome = useCallback(() => {
    void navigate('/');
  }, [navigate]);

  const handleRetry = useCallback(() => {
    if (!result) return;
    void navigate(`/game/${result.mode}`);
  }, [navigate, result]);

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const topScores = data.topScores[result.mode];
  const bestScore = getBestScore(data, result.mode);
  const unit = SCORE_UNITS[result.mode];

  return (
    <div className="min-h-screen bg-casino-gradient">
      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-casino-gold">
          🎊 ゲーム終了！ 🎊
        </h1>

        {result.isNewRecord && result.rank !== null && result.rank <= 3 && (
          <NewRecordAnimation rank={result.rank as 1 | 2 | 3} />
        )}

        <div className="space-y-6">
          <ScoreCard
            mode={result.mode}
            score={result.score}
            bestScore={bestScore}
          />

          <TopScoresComparison
            scores={topScores}
            unit={unit}
            newRank={result.rank}
          />

          <MotivationMessage mode={result.mode} score={result.score} />

          <ShareSection
            mode={result.mode}
            score={result.score}
            bestScore={bestScore}
            isNewRecord={result.isNewRecord}
            rank={result.rank}
          />

          <AdPlaceholder
            isLoaded={false}
            hasError={false}
            clientId=""
            adSlot=""
            className="my-4"
          />

          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} variant="primary" className="w-full">
              🔄 同じモードで再挑戦
            </Button>
            <Button
              onClick={handleGoHome}
              variant="secondary"
              className="w-full"
            >
              🏠 ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
