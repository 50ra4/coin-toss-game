import { useCallback, useState } from 'react';
import type { GameMode } from '@/consts/game';
import type { Preferences, StorageData } from './storage.schema';
import {
  loadStorageData,
  saveStorageData,
  updateTopScores,
} from './storageOperations';

export const useGameStorage = () => {
  const [data, setData] = useState<StorageData>(loadStorageData);

  const saveScore = useCallback(
    (mode: GameMode, score: number) => {
      const result = updateTopScores(data, mode, score);
      saveStorageData(result.data);
      setData(result.data);
      return { isNewRecord: result.isNewRecord, rank: result.rank };
    },
    [data]
  );

  const updatePreferences = useCallback(
    (patch: Partial<Preferences>) => {
      const newData: StorageData = {
        ...data,
        preferences: { ...data.preferences, ...patch },
      };
      saveStorageData(newData);
      setData(newData);
    },
    [data]
  );

  return { data, saveScore, updatePreferences };
};
