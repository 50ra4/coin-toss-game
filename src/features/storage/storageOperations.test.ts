import { describe, it, expect, beforeEach } from 'vitest';
import type { StorageData } from './storage.schema';
import { defaultStorageData } from './storage.schema';
import {
  getBestScore,
  updateTopScores,
  loadStorageData,
  saveStorageData,
} from './storageOperations';

const createStorageData = (overrides?: Partial<StorageData>): StorageData => ({
  ...defaultStorageData,
  ...overrides,
});

describe('getBestScore', () => {
  it('スコアがないとき 0 を返す', () => {
    const data = createStorageData();
    expect(getBestScore(data, 'tenRounds')).toBe(0);
  });

  it('最高スコアを返す', () => {
    const data = createStorageData({
      topScores: {
        tenRounds: [{ score: 8 }, { score: 5 }, { score: 3 }],
        survival: [],
      },
    });
    expect(getBestScore(data, 'tenRounds')).toBe(8);
  });

  it('スコアが1件でも正しく返す', () => {
    const data = createStorageData({
      topScores: {
        tenRounds: [{ score: 7 }],
        survival: [],
      },
    });
    expect(getBestScore(data, 'tenRounds')).toBe(7);
  });

  it('モードごとに独立したスコアを返す', () => {
    const data = createStorageData({
      topScores: {
        tenRounds: [{ score: 8 }],
        survival: [{ score: 15 }],
      },
    });
    expect(getBestScore(data, 'tenRounds')).toBe(8);
    expect(getBestScore(data, 'survival')).toBe(15);
  });
});

describe('updateTopScores', () => {
  it('空のスコアに新スコアを追加できる', () => {
    const data = createStorageData();
    const result = updateTopScores(data, 'tenRounds', 5);

    expect(result.isNewRecord).toBe(true);
    expect(result.rank).toBe(1);
    expect(result.data.topScores.tenRounds).toEqual([{ score: 5 }]);
  });

  it('スコアが降順にソートされる', () => {
    const data = createStorageData({
      topScores: {
        tenRounds: [{ score: 8 }, { score: 3 }],
        survival: [],
      },
    });
    const result = updateTopScores(data, 'tenRounds', 5);

    expect(result.data.topScores.tenRounds).toEqual([
      { score: 8 },
      { score: 5 },
      { score: 3 },
    ]);
    expect(result.rank).toBe(2);
  });

  it('上位3件のみ保持する', () => {
    const data = createStorageData({
      topScores: {
        tenRounds: [{ score: 10 }, { score: 8 }, { score: 5 }],
        survival: [],
      },
    });
    const result = updateTopScores(data, 'tenRounds', 7);

    expect(result.data.topScores.tenRounds).toHaveLength(3);
    expect(result.data.topScores.tenRounds).toEqual([
      { score: 10 },
      { score: 8 },
      { score: 7 },
    ]);
    expect(result.rank).toBe(3);
  });

  it('TOP3圏外のスコアは新記録にならない', () => {
    const data = createStorageData({
      topScores: {
        tenRounds: [{ score: 10 }, { score: 8 }, { score: 5 }],
        survival: [],
      },
    });
    const result = updateTopScores(data, 'tenRounds', 3);

    expect(result.isNewRecord).toBe(false);
    expect(result.rank).toBeNull();
    expect(result.data.topScores.tenRounds).toEqual([
      { score: 10 },
      { score: 8 },
      { score: 5 },
    ]);
  });

  it('他モードのスコアに影響しない', () => {
    const data = createStorageData({
      topScores: {
        tenRounds: [{ score: 8 }],
        survival: [{ score: 15 }],
      },
    });
    const result = updateTopScores(data, 'tenRounds', 10);

    expect(result.data.topScores.survival).toEqual([{ score: 15 }]);
  });
});

describe('loadStorageData / saveStorageData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('データがない場合デフォルト値を返す', () => {
    const data = loadStorageData();
    expect(data).toEqual(defaultStorageData);
  });

  it('保存したデータを読み込める', () => {
    const data = createStorageData({
      topScores: {
        tenRounds: [{ score: 8 }],
        survival: [],
      },
    });
    saveStorageData(data);
    const loaded = loadStorageData();
    expect(loaded).toEqual(data);
  });

  it('不正なデータの場合デフォルト値を返す', () => {
    localStorage.setItem('coinTossGame', 'invalid json{{{');
    const data = loadStorageData();
    expect(data).toEqual(defaultStorageData);
  });
});
