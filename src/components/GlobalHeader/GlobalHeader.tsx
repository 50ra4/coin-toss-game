import { ToggleSwitch } from '@/components/ToggleSwitch/ToggleSwitch';
import { Icon } from '@/components/Icon/Icon';

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
      <h1 className="flex min-w-0 items-center gap-2 truncate font-display text-lg font-semibold text-amber-700 dark:text-casino-gold">
        <Icon name="monetization_on" filled size={22} />
        Coin Toss Game
      </h1>
      <div className="flex shrink-0 items-center gap-2">
        <ToggleSwitch
          label="ダークモード"
          icon={<Icon name="dark_mode" size={18} />}
          checked={darkMode}
          onChange={onToggleDarkMode}
        />
        <ToggleSwitch
          label="サウンド"
          icon={<Icon name="volume_up" size={18} />}
          checked={soundEnabled}
          onChange={onToggleSound}
        />
      </div>
    </header>
  );
}
