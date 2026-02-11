import { describe, it, expect, vi } from 'vitest';
import { flipCoin } from './coinFlip';

describe('flipCoin', () => {
  it('Math.random < 0.5 のとき heads を返す', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    expect(flipCoin()).toBe('heads');
    vi.restoreAllMocks();
  });

  it('Math.random >= 0.5 のとき tails を返す', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.7);
    expect(flipCoin()).toBe('tails');
    vi.restoreAllMocks();
  });

  it('境界値 0.5 のとき tails を返す', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(flipCoin()).toBe('tails');
    vi.restoreAllMocks();
  });

  it('境界値 0.0 のとき heads を返す', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    expect(flipCoin()).toBe('heads');
    vi.restoreAllMocks();
  });

  it('heads または tails のみを返す', () => {
    vi.restoreAllMocks();
    const results = new Set(Array.from({ length: 100 }, () => flipCoin()));
    for (const result of results) {
      expect(['heads', 'tails']).toContain(result);
    }
  });
});
