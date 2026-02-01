import { IconButton } from '@mui/material';
import { useState } from 'react';
import Icon from '../common/Icon';

interface SwapButtonProps {
  onClick: () => void;
  variant?: 'horizontal' | 'vertical';
}

function SwapButton({ onClick, variant = 'horizontal' }: SwapButtonProps) {
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    onClick();
    setTimeout(() => setIsRotating(false), 300);
  };

  const iconName = variant === 'horizontal' ? 'swap_horiz' : 'swap_vert';
  const iconSize = variant === 'horizontal' ? '18px' : '20px';

  if (variant === 'vertical') {
    // Mobile variant
    return (
      <IconButton
        onClick={handleClick}
        aria-label="Swap origin and destination"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          color: '#135bec',
          transform: isRotating ? 'rotate(180deg) scale(0.95)' : 'rotate(0deg) scale(1)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms',
          '&:hover': {
            backgroundColor: '#f9fafb',
          },
          '&:active': {
            transform: 'rotate(180deg) scale(0.95)',
          },
        }}
      >
        <Icon
          name={iconName}
          className="swap-icon-mobile"
        />
        <style>
          {`
            .swap-icon-mobile {
              font-size: ${iconSize} !important;
            }
          `}
        </style>
      </IconButton>
    );
  }

  // Desktop horizontal variant
  return (
    <IconButton
      onClick={handleClick}
      aria-label="Swap origin and destination"
      sx={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '50%',
        padding: '6px',
        color: '#9ca3af',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transform: isRotating ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: '#135bec',
          color: '#135bec',
          backgroundColor: '#ffffff',
        },
        '&:active': {
          transform: 'rotate(180deg)',
        },
      }}
    >
      <Icon
        name={iconName}
        className="swap-icon-desktop"
      />
      <style>
        {`
          .swap-icon-desktop {
            font-size: ${iconSize} !important;
          }
        `}
      </style>
    </IconButton>
  );
}

export default SwapButton;
