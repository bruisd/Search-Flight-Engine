import { CSSProperties } from 'react';

interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  filled?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '28px',
};

function Icon({
  name,
  size = 'md',
  className = '',
  filled = false,
  onClick,
}: IconProps) {
  const style: CSSProperties = {
    fontSize: sizeMap[size],
    fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
    userSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onClick ? 'pointer' : 'default',
  };

  const handleClick = onClick
    ? (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        onClick();
      }
    : undefined;

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={style}
      role="img"
      aria-label={name}
      onClick={handleClick}
    >
      {name}
    </span>
  );
}

export default Icon;
