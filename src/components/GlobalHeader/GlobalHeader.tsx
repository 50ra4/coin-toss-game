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
      <h1 className="text-lg font-bold text-casino-gold">🪙 Coin Toss Game</h1>
      <div className="flex items-center gap-3">
        <ToggleSwitch
          label="ダークモード"
          checked={darkMode}
          onChange={onToggleDarkMode}
        />
        <ToggleSwitch
          label="サウンド"
          checked={soundEnabled}
          onChange={onToggleSound}
        />
      </div>
    </header>
  );
}
