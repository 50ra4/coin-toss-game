type Props = {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary';
  className: string;
  disabled?: boolean;
};

export function Button({
  children,
  onClick,
  variant,
  className,
  disabled = false,
}: Props) {
  const baseClass =
    variant === 'primary' ? 'coin-btn' : 'coin-btn-secondary';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className} disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  );
}
