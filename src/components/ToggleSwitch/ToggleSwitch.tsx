import type { ReactNode } from 'react';

type Props = {
  label: string;
  icon: ReactNode;
  checked: boolean;
  onChange: () => void;
};

export function ToggleSwitch({ label, icon, checked, onChange }: Props) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="text-sm text-gray-500 dark:text-gray-400"
        aria-hidden="true"
      >
        {icon}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          checked
            ? 'bg-amber-500 dark:bg-casino-gold'
            : 'bg-gray-400 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
