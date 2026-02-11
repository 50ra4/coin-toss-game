import { useCallback, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import type { GameMode } from '@/consts/game';
import { GAME_MODES, SCORE_UNITS } from '@/consts/game';
import { GameModeSchema } from '@/features/game/game.schema';
import { useGameLogic } from '@/features/game/useGameLogic';
import { useGameStorage } from '@/features/storage/useGameStorage';
import { getBestScore } from '@/features/storage/storageOperations';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useSound } from '@/hooks/useSound';
import { GlobalHeader } from '@/components/GlobalHeader/GlobalHeader';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/Button/Button';
import { CoinFlip3D } from '@/features/game/CoinFlip3D/CoinFlip3D';
import { PredictionButton } from '@/features/game/PredictionButton/PredictionButton';
import { ScoreDisplay } from '@/features/game/ScoreDisplay/ScoreDisplay';
import { ResultFeedback } from '@/features/game/ResultFeedback/ResultFeedback';
import { StreakNotification } from '@/features/game/StreakNotification/StreakNotification';
import type { GameResult } from '@/features/result/result.schema';

export function GamePage() {
  const { mode: modeParam } = useParams<{ mode: string }>();
  const parsed = GameModeSchema.safeParse(modeParam);

  if (!parsed.success) {
    return <Navigate to="/" replace />;
  }

  return <GamePageContent mode={parsed.data} />;
}

type ContentProps = {
  mode: GameMode;
};

function GamePageContent({ mode }: ContentProps) {
  const navigate = useNavigate();
  const { data, saveScore } = useGameStorage();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { soundEnabled, toggleSound, playSound } = useSound();
  const { state, predict, nextRound } = useGameLogic(mode);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);

  const bestScore = getBestScore(data, mode);

  const handlePredict = useCallback(
    (side: Parameters<typeof predict>[0]) => {
      playSound('coinToss');
      predict(side);
    },
    [predict, playSound],
  );

  const handleNextRound = useCallback(() => {
    if (state.isCorrect !== null) {
      playSound(state.isCorrect ? 'correct' : 'incorrect');
    }
    nextRound();
  }, [nextRound, playSound, state.isCorrect]);

  const handleFinish = useCallback(() => {
    const { isNewRecord, rank } = saveScore(mode, state.score);
    const result: GameResult = {
      mode,
      score: state.score,
      isNewRecord,
      rank,
      previousBest: bestScore,
    };
    void navigate('/result', { state: result });
  }, [mode, state.score, bestScore, saveScore, navigate]);

  const handleGiveUp = useCallback(() => {
    setShowGiveUpModal(true);
  }, []);

  const handleGiveUpConfirm = useCallback(() => {
    setShowGiveUpModal(false);
    handleFinish();
  }, [handleFinish]);

  const handleGiveUpCancel = useCallback(() => {
    setShowGiveUpModal(false);
  }, []);

  const isFlipping = state.phase === 'flipping';
  const isPredictionDisabled = state.phase !== 'ready';

  if (state.phase === 'finished') {
    handleFinish();
    return null;
  }

  return (
    <div className="min-h-screen bg-casino-gradient">
      <GlobalHeader
        darkMode={darkMode}
        soundEnabled={soundEnabled}
        onToggleDarkMode={toggleDarkMode}
        onToggleSound={toggleSound}
      />

      <div className="mx-auto max-w-lg px-4 py-4">
        <ScoreDisplay
          mode={mode}
          score={state.score}
          currentRound={state.currentRound}
          consecutiveCorrect={state.consecutiveCorrect}
        />

        <CoinFlip3D result={state.coinResult} isFlipping={isFlipping} />

        <StreakNotification consecutiveCorrect={state.consecutiveCorrect} />

        <ResultFeedback isCorrect={state.isCorrect} />

        {state.phase === 'ready' && (
          <div className="py-4">
            <p className="mb-4 text-center text-gray-400">予想してください</p>
            <PredictionButton
              onPredict={handlePredict}
              disabled={isPredictionDisabled}
            />
          </div>
        )}

        {state.phase === 'result' && (
          <div className="flex justify-center py-4">
            <Button
              onClick={handleNextRound}
              variant="primary"
              className="px-8"
            >
              次のラウンドへ
            </Button>
          </div>
        )}

        {mode === GAME_MODES.survival && state.phase === 'ready' && (
          <div className="flex justify-center py-4">
            <Button
              onClick={handleGiveUp}
              variant="secondary"
              className="text-sm"
            >
              ギブアップ
            </Button>
          </div>
        )}
      </div>

      <Modal open={showGiveUpModal} onClose={handleGiveUpCancel}>
        <h2 className="mb-4 text-center text-lg font-bold text-casino-gold">
          ギブアップしますか？
        </h2>
        <p className="mb-6 text-center text-sm text-gray-400">
          {`現在のスコア: ${state.score}${SCORE_UNITS[mode]}`}
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleGiveUpCancel}
            variant="secondary"
            className="px-6"
          >
            続ける
          </Button>
          <Button
            onClick={handleGiveUpConfirm}
            variant="primary"
            className="px-6"
          >
            終了する
          </Button>
        </div>
      </Modal>
    </div>
  );
}
