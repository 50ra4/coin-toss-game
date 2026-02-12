import { describe, it, expect } from 'vitest';
import { GameResultSchema } from './result.schema';

describe('GameResultSchema', () => {
  it('有効な結果をパースできる', () => {
    const result = {
      mode: 'tenRounds',
      score: 8,
      isNewRecord: true,
      rank: 1,
      previousBest: 7,
    };

    expect(GameResultSchema.parse(result)).toEqual(result);
  });

  it('rankがnullの場合を受け入れる', () => {
    const result = {
      mode: 'survival',
      score: 3,
      isNewRecord: false,
      rank: null,
      previousBest: 10,
    };

    expect(GameResultSchema.parse(result)).toEqual(result);
  });

  it('rankが1〜3の範囲外の場合を拒否する', () => {
    const result = {
      mode: 'tenRounds',
      score: 5,
      isNewRecord: true,
      rank: 4,
      previousBest: 3,
    };

    expect(() => GameResultSchema.parse(result)).toThrow();
  });

  it('rankが0の場合を拒否する', () => {
    const result = {
      mode: 'tenRounds',
      score: 5,
      isNewRecord: true,
      rank: 0,
      previousBest: 3,
    };

    expect(() => GameResultSchema.parse(result)).toThrow();
  });

  it('scoreが負の値の場合を拒否する', () => {
    const result = {
      mode: 'tenRounds',
      score: -1,
      isNewRecord: false,
      rank: null,
      previousBest: 0,
    };

    expect(() => GameResultSchema.parse(result)).toThrow();
  });

  it('不正なmodeを拒否する', () => {
    const result = {
      mode: 'invalid',
      score: 5,
      isNewRecord: false,
      rank: null,
      previousBest: 0,
    };

    expect(() => GameResultSchema.parse(result)).toThrow();
  });

  it('必須フィールドが欠落している場合を拒否する', () => {
    expect(() => GameResultSchema.parse({ mode: 'tenRounds' })).toThrow();
    expect(() => GameResultSchema.parse({})).toThrow();
    expect(() => GameResultSchema.parse(null)).toThrow();
  });
});
