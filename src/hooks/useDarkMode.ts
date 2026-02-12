import { useCallback } from 'react';
import { useGameStorage } from '@/features/storage/useGameStorage';

export const useDarkMode = () => {
  const { data, updatePreferences } = useGameStorage();
  const darkMode = data.preferences.darkMode;

  const toggleDarkMode = useCallback(() => {
    const newValue = !darkMode;
    document.documentElement.classList.toggle('dark', newValue);
    updatePreferences({ darkMode: newValue });
  }, [darkMode, updatePreferences]);

  return { darkMode, toggleDarkMode };
};
