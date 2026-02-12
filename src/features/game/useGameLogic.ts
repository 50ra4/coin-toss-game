import { useCallback, useState } from 'react';
import type { CoinSide, GameMode } from '@/consts/game';
import { GAME_MODES } from '@/consts/game';
import { flipCoin } from '@/utils/coinFlip';

type GamePhase = 'ready' | 'flipping' | 'result' | 'finished';

type GameState = {
  mode: GameMode;
  currentRound: number;
  score: number;
  consecutiveCorrect: number;
  phase: GamePhase;
  coinResult: CoinSide | null;
  prediction: CoinSide | null;
  isCorrect: boolean | null;
};

const createInitialState = (mode: GameMode): GameState => ({
  mode,
  currentRound: 1,
  score: 0,
  consecutiveCorrect: 0,
  phase: 'ready',
  coinResult: null,
  prediction: null,
  isCorrect: null,
});

const TEN_ROUNDS_MAX = 10;
const FLIP_DURATION_MS = 2000;

export const useGameLogic = (mode: GameMode) => {
  const [state, setState] = useState<GameState>(() => createInitialState(mode));

  const predict = useCallback(
    (side: CoinSide) => {
      if (state.phase !== 'ready') return;

      const result = flipCoin();

      setState((prev) => ({
        ...prev,
        prediction: side,
        coinResult: result,
        phase: 'flipping',
      }));

      setTimeout(() => {
        setState((prev) => {
          if (!prev.coinResult || !prev.prediction) return prev;

          const correct = prev.coinResult === prev.prediction;
          const newScore = correct ? prev.score + 1 : prev.score;
          const newConsecutive = correct ? prev.consecutiveCorrect + 1 : 0;

          const isGameOver =
            prev.mode === GAME_MODES.survival
              ? !correct
              : prev.currentRound >= TEN_ROUNDS_MAX;

          return {
            ...prev,
            score: newScore,
            consecutiveCorrect: newConsecutive,
            isCorrect: correct,
            phase: isGameOver ? 'finished' : 'result',
          };
        });
      }, FLIP_DURATION_MS);
    },
    [state.phase],
  );

  const nextRound = useCallback(() => {
    if (state.phase !== 'result') return;

    setState((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      coinResult: null,
      prediction: null,
      isCorrect: null,
      phase: 'ready',
    }));
  }, [state.phase]);

  const reset = useCallback(() => {
    setState(createInitialState(mode));
  }, [mode]);

  return { state, predict, nextRound, reset };
};
