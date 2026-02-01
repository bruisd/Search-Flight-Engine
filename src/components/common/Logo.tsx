import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

interface LogoProps {
  variant?: 'desktop' | 'mobile';
  showText?: boolean;
  onClick?: () => void;
}

function Logo({ variant, showText = true, onClick }: LogoProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const displayVariant = variant || (isMobile ? 'mobile' : 'desktop');

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  if (displayVariant === 'mobile') {
    return (
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Icon Container - Mobile */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#135bec',
          }}
        >
          <Icon
            name="flight_takeoff"
            className="logo-icon-mobile"
          />
          <style>
            {`
              .logo-icon-mobile {
                color: #ffffff;
                font-size: 20px !important;
              }
            `}
          </style>
        </Box>

        {/* Brand Text - Mobile */}
        {showText && (
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              color: '#111318',
              lineHeight: 1.2,
            }}
          >
            Flight Search
          </Typography>
        )}
      </Box>
    );
  }

  // Desktop version
  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        userSelect: 'none',
        color: '#111318',
      }}
    >
      {/* Icon Container - Desktop */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: 'rgba(19, 91, 236, 0.1)',
        }}
      >
        <Icon
          name="airlines"
          className="logo-icon-desktop"
        />
        <style>
          {`
            .logo-icon-desktop {
              color: #135bec;
              font-size: 28px !important;
            }
          `}
        </style>
      </Box>

      {/* Brand Text - Desktop */}
      {showText && (
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
            color: '#111318',
          }}
        >
          Flight Search
        </Typography>
      )}
    </Box>
  );
}

export default Logo;
