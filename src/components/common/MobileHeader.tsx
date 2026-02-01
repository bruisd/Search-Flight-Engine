import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Icon from './Icon';
import MobileMenu from './MobileMenu';

interface MobileHeaderProps {
  variant: 'homepage' | 'results';
  origin?: string;
  destination?: string;
  dateRange?: string;
  passengers?: number;
  onBack?: () => void;
  onModify?: () => void;
}

function MobileHeader({
  variant,
  origin,
  destination,
  dateRange,
  passengers,
  onBack,
  onModify,
}: MobileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  if (variant === 'results') {
    return (
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(246, 246, 248, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
          }}
        >
          {/* Back Button */}
          <IconButton
            onClick={handleBack}
            sx={{
              width: '40px',
              height: '40px',
              marginLeft: '-8px',
              borderRadius: '9999px',
              color: '#111318',
              '&:hover': {
                backgroundColor: '#f6f6f8',
              },
            }}
          >
            <Icon name="arrow_back" size="md" />
          </IconButton>

          {/* Center: Route Info */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              mx: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#111318',
                lineHeight: 1.3,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {origin || 'JFK'}
              <Box
                component="span"
                sx={{
                  color: '#9ca3af',
                  mx: '4px',
                }}
              >
                →
              </Box>
              {destination || 'LHR'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#616f89',
                lineHeight: 1.4,
              }}
            >
              {dateRange || 'Oct 24 - Oct 31'} • {passengers || 1} Passenger{passengers !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Modify Button */}
          <IconButton
            onClick={onModify}
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#135bec',
              padding: '8px 12px',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(19, 91, 236, 0.1)',
              },
            }}
          >
            Modify
          </IconButton>
        </Box>
      </Box>
    );
  }

  // Homepage variant
  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: 'rgba(246, 246, 248, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #f0f2f4',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo variant="mobile" />
        </Box>

        {/* Menu Button */}
        <IconButton
          onClick={() => setMenuOpen(true)}
          sx={{
            padding: '8px',
            marginRight: '-8px',
            color: '#616f89',
            borderRadius: '9999px',
            '&:hover': {
              color: '#135bec',
              backgroundColor: 'transparent',
            },
          }}
        >
          <Icon
            name="menu"
            className="mobile-menu-icon"
          />
          <style>
            {`
              .mobile-menu-icon {
                font-size: 28px !important;
              }
            `}
          </style>
        </IconButton>
      </Box>

      {/* Mobile Menu Drawer */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default MobileHeader;
