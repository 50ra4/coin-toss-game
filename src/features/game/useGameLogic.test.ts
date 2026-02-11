import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameLogic } from './useGameLogic';

// Math.random < 0.5 → heads, >= 0.5 → tails
const mockHeads = () => vi.spyOn(Math, 'random').mockReturnValue(0.3);
const mockTails = () => vi.spyOn(Math, 'random').mockReturnValue(0.7);

describe('useGameLogic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('初期状態', () => {
    it('tenRoundsモードの初期状態が正しい', () => {
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      expect(result.current.state).toEqual({
        mode: 'tenRounds',
        currentRound: 1,
        score: 0,
        consecutiveCorrect: 0,
        phase: 'ready',
        coinResult: null,
        prediction: null,
        isCorrect: null,
      });
    });

    it('survivalモードの初期状態が正しい', () => {
      const { result } = renderHook(() => useGameLogic('survival'));

      expect(result.current.state.mode).toBe('survival');
      expect(result.current.state.phase).toBe('ready');
    });
  });

  describe('predict', () => {
    it('予想するとflippingフェーズになる', () => {
      mockHeads();
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      act(() => {
        result.current.predict('heads');
      });

      expect(result.current.state.phase).toBe('flipping');
      expect(result.current.state.prediction).toBe('heads');
      expect(result.current.state.coinResult).toBe('heads');
    });

    it('flipping中は予想を受け付けない', () => {
      mockHeads();
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      act(() => {
        result.current.predict('heads');
      });

      act(() => {
        result.current.predict('tails');
      });

      expect(result.current.state.prediction).toBe('heads');
    });

    it('正解の場合スコアが増える', () => {
      mockHeads();
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      act(() => {
        result.current.predict('heads');
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.state.isCorrect).toBe(true);
      expect(result.current.state.score).toBe(1);
      expect(result.current.state.consecutiveCorrect).toBe(1);
    });

    it('不正解の場合スコアが増えず連続正解がリセットされる', () => {
      mockTails();
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      act(() => {
        result.current.predict('heads');
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.state.isCorrect).toBe(false);
      expect(result.current.state.score).toBe(0);
      expect(result.current.state.consecutiveCorrect).toBe(0);
    });
  });

  describe('tenRoundsモード', () => {
    it('10ラウンド目でfinishedになる', () => {
      mockHeads();
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      for (let i = 0; i < 9; i++) {
        act(() => {
          result.current.predict('heads');
        });
        act(() => {
          vi.advanceTimersByTime(2000);
        });
        act(() => {
          result.current.nextRound();
        });
      }

      expect(result.current.state.currentRound).toBe(10);

      act(() => {
        result.current.predict('heads');
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.state.phase).toBe('finished');
    });

    it('不正解でも10ラウンドまで続く', () => {
      mockTails();
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      act(() => {
        result.current.predict('heads');
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.state.phase).toBe('result');
    });
  });

  describe('survivalモード', () => {
    it('不正解でfinishedになる', () => {
      mockTails();
      const { result } = renderHook(() => useGameLogic('survival'));

      act(() => {
        result.current.predict('heads');
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.state.phase).toBe('finished');
    });

    it('正解の場合は続行できる', () => {
      mockHeads();
      const { result } = renderHook(() => useGameLogic('survival'));

      act(() => {
        result.current.predict('heads');
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.state.phase).toBe('result');
    });
  });

  describe('nextRound', () => {
    it('resultフェーズで次のラウンドに進める', () => {
      mockHeads();
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      act(() => {
        result.current.predict('heads');
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      act(() => {
        result.current.nextRound();
      });

      expect(result.current.state.phase).toBe('ready');
      expect(result.current.state.currentRound).toBe(2);
      expect(result.current.state.coinResult).toBeNull();
      expect(result.current.state.prediction).toBeNull();
      expect(result.current.state.isCorrect).toBeNull();
    });

    it('readyフェーズでは何もしない', () => {
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      act(() => {
        result.current.nextRound();
      });

      expect(result.current.state.currentRound).toBe(1);
    });
  });

  describe('reset', () => {
    it('初期状態にリセットされる', () => {
      mockHeads();
      const { result } = renderHook(() => useGameLogic('tenRounds'));

      act(() => {
        result.current.predict('heads');
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      act(() => {
        result.current.reset();
      });

      expect(result.current.state).toEqual({
        mode: 'tenRounds',
        currentRound: 1,
        score: 0,
        consecutiveCorrect: 0,
        phase: 'ready',
        coinResult: null,
        prediction: null,
        isCorrect: null,
      });
    });
  });
});
