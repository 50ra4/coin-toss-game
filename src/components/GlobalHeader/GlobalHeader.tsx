import { ToggleSwitch } from '@/components/ToggleSwitch/ToggleSwitch';

type Props = {
  darkMode: boolean;
  soundEnabled: boolean;
  onToggleDarkMode: () => void;
  onToggleSound: () => void;
};

export function GlobalHeader({
  darkMode,
  soundEnabled,
  onToggleDarkMode,
  onToggleSound,
}: Props) {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <h1 className="min-w-0 truncate text-lg font-bold text-casino-gold">
        🪙 Coin Toss Game
      </h1>
      <div className="flex shrink-0 items-center gap-2">
        <ToggleSwitch
          label="ダークモード"
          icon="🌙"
          checked={darkMode}
          onChange={onToggleDarkMode}
        />
        <ToggleSwitch
          label="サウンド"
          icon="🔊"
          checked={soundEnabled}
          onChange={onToggleSound}
        />
      </div>
    </header>
  );
}
