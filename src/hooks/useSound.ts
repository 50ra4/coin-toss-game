import { useCallback } from 'react';
import { audioService } from '@/services/audio.service';
import { useGameStorage } from '@/features/storage/useGameStorage';

export const useSound = () => {
  const { data, updatePreferences } = useGameStorage();
  const soundEnabled = data.preferences.soundEnabled;

  const toggleSound = useCallback(() => {
    updatePreferences({ soundEnabled: !soundEnabled });
  }, [soundEnabled, updatePreferences]);

  const playSound = useCallback(
    (
      sound:
        | 'coinToss'
        | 'correct'
        | 'incorrect'
        | 'newRecord1'
        | 'newRecord2'
        | 'newRecord3'
    ) => {
      if (!soundEnabled) return;

      switch (sound) {
        case 'coinToss':
          audioService.playCoinTossSound();
          break;
        case 'correct':
          audioService.playCorrectSound();
          break;
        case 'incorrect':
          audioService.playIncorrectSound();
          break;
        case 'newRecord1':
          audioService.playNewRecordSound(1);
          break;
        case 'newRecord2':
          audioService.playNewRecordSound(2);
          break;
        case 'newRecord3':
          audioService.playNewRecordSound(3);
          break;
      }
    },
    [soundEnabled]
  );

  return { soundEnabled, toggleSound, playSound };
};
