import { memo } from 'react';

type Props = {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
};

export const Icon = memo(function Icon({
  name,
  filled = false,
  size,
  className = '',
}: Props) {
  const sizeStyle = size ? { fontSize: `${size}px` } : undefined;

  return (
    <span
      className={`material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`}
      style={sizeStyle}
    >
      {name}
    </span>
  );
});
