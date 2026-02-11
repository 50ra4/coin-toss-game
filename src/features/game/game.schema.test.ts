import { describe, it, expect } from 'vitest';
import { GameModeSchema, CoinSideSchema, GameStateSchema } from './game.schema';

describe('GameModeSchema', () => {
  it('tenRoundsを受け入れる', () => {
    expect(GameModeSchema.parse('tenRounds')).toBe('tenRounds');
  });

  it('survivalを受け入れる', () => {
    expect(GameModeSchema.parse('survival')).toBe('survival');
  });

  it('不正な値を拒否する', () => {
    expect(() => GameModeSchema.parse('invalid')).toThrow();
  });

  it('空文字を拒否する', () => {
    expect(() => GameModeSchema.parse('')).toThrow();
  });

  it('数値を拒否する', () => {
    expect(() => GameModeSchema.parse(123)).toThrow();
  });
});

describe('CoinSideSchema', () => {
  it('headsを受け入れる', () => {
    expect(CoinSideSchema.parse('heads')).toBe('heads');
  });

  it('tailsを受け入れる', () => {
    expect(CoinSideSchema.parse('tails')).toBe('tails');
  });

  it('不正な値を拒否する', () => {
    expect(() => CoinSideSchema.parse('edge')).toThrow();
  });
});

describe('GameStateSchema', () => {
  it('有効なゲーム状態をパースできる', () => {
    const state = {
      mode: 'tenRounds',
      currentRound: 5,
      score: 3,
      isPlaying: true,
      coinResult: 'heads',
      prediction: 'tails',
      consecutiveCorrect: 2,
    };

    expect(GameStateSchema.parse(state)).toEqual(state);
  });

  it('coinResultとpredictionはnullを受け入れる', () => {
    const state = {
      mode: 'survival',
      currentRound: 1,
      score: 0,
      isPlaying: true,
      coinResult: null,
      prediction: null,
      consecutiveCorrect: 0,
    };

    expect(GameStateSchema.parse(state)).toEqual(state);
  });

  it('currentRoundが0以下の場合を拒否する', () => {
    const state = {
      mode: 'tenRounds',
      currentRound: 0,
      score: 0,
      isPlaying: true,
      coinResult: null,
      prediction: null,
      consecutiveCorrect: 0,
    };

    expect(() => GameStateSchema.parse(state)).toThrow();
  });

  it('scoreが負の値の場合を拒否する', () => {
    const state = {
      mode: 'tenRounds',
      currentRound: 1,
      score: -1,
      isPlaying: true,
      coinResult: null,
      prediction: null,
      consecutiveCorrect: 0,
    };

    expect(() => GameStateSchema.parse(state)).toThrow();
  });

  it('不正なmodeを拒否する', () => {
    const state = {
      mode: 'invalid',
      currentRound: 1,
      score: 0,
      isPlaying: true,
      coinResult: null,
      prediction: null,
      consecutiveCorrect: 0,
    };

    expect(() => GameStateSchema.parse(state)).toThrow();
  });
});
