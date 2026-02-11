import type { GameMode } from '@/consts/game';
import type { StorageData } from './storage.schema';
import { StorageDataSchema, defaultStorageData } from './storage.schema';

const STORAGE_KEY = 'coinTossGame';

export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const loadStorageData = (): StorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultStorageData };

    const parsed: unknown = JSON.parse(raw);
    return StorageDataSchema.parse(parsed);
  } catch (error) {
    console.error('LocalStorage data invalid. Using default values:', error);
    return { ...defaultStorageData };
  }
};

export const saveStorageData = (data: StorageData): void => {
  try {
    const validated = StorageDataSchema.parse(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
  } catch (error) {
    console.error('Invalid save data:', error);
    throw error;
  }
};

export const getBestScore = (data: StorageData, mode: GameMode): number =>
  Math.max(0, ...data.topScores[mode].map((item) => item.score));

export const updateTopScores = (
  data: StorageData,
  mode: GameMode,
  newScore: number
): { data: StorageData; isNewRecord: boolean; rank: number | null } => {
  const currentScores = [...data.topScores[mode]];

  currentScores.push({ score: newScore });
  currentScores.sort((a, b) => b.score - a.score);

  const topThree = currentScores.slice(0, 3);
  const newRank = topThree.findIndex((item) => item.score === newScore);
  const isNewRecord = newRank !== -1;

  return {
    data: {
      ...data,
      topScores: {
        ...data.topScores,
        [mode]: topThree,
      },
    },
    isNewRecord,
    rank: isNewRecord ? newRank + 1 : null,
  };
};
