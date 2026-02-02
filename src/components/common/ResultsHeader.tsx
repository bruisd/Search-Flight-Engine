import {
  Box,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import Icon from './Icon';
import MobileHeader from './MobileHeader';
import type { SearchParams } from '../../types';

interface ResultsHeaderProps {
  searchParams: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    cabinClass: string;
  };
  onSearch: (params: SearchParams) => void;
  onSwap: () => void;
}

function ResultsHeader({ searchParams, onSearch, onSwap }: ResultsHeaderProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [formValues, setFormValues] = useState(searchParams);

  const handleInputChange = (field: string, value: string | number) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(formValues as SearchParams);
  };

  // Mobile: use MobileHeader
  if (!isDesktop) {
    return (
      <MobileHeader
        variant="results"
        origin={searchParams.origin}
        destination={searchParams.destination}
        dateRange={`${searchParams.departureDate}${searchParams.returnDate ? ' - ' + searchParams.returnDate : ''}`}
        passengers={searchParams.passengers}
      />
    );
  }

  // Desktop: two-row header
  return (
    <Box
      component="header"
      sx={{
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Top Navigation Row */}
      <Box
        sx={{
          borderBottom: '1px solid #f0f2f4',
          padding: { xs: '12px 16px', lg: '12px 40px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Box
            sx={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(19, 91, 236, 0.1)',
              borderRadius: '8px',
              color: '#135bec',
            }}
          >
            <Icon name="flight_takeoff" className="header-logo-icon" />
            <style>
              {`
                .header-logo-icon {
                  font-size: 24px !important;
                }
              `}
            </style>
          </Box>
          <Box
            component="h2"
            sx={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#111318',
            }}
          >
            Flight Search
          </Box>
        </Box>

        {/* Right: USD */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Box
            component="span"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#616f89',
              cursor: 'pointer',
              '&:hover': {
                color: '#135bec',
              },
            }}
          >
            USD
          </Box>
        </Box>
      </Box>

      {/* Search Inputs Strip (Desktop only) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          padding: '16px 40px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f0f2f4',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f6f6f8',
            padding: '8px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            maxWidth: '960px',
            width: '100%',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Origin Input */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              borderRight: '1px solid #e5e7eb',
              paddingRight: '8px',
            }}
          >
            <Box
              component="label"
              sx={{
                position: 'absolute',
                top: '8px',
                left: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#616f89',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
              }}
            >
              From
            </Box>
            <TextField
              value={formValues.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  paddingTop: '24px',
                  paddingBottom: '8px',
                  paddingX: '16px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111318',
                },
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  backgroundColor: 'transparent',
                  border: 'none',
                },
              }}
            />
          </Box>

          {/* Swap Button */}
          <IconButton
            onClick={onSwap}
            sx={{
              padding: '8px',
              borderRadius: '9999px',
              color: '#9ca3af',
              '&:hover': {
                backgroundColor: '#e5e7eb',
              },
            }}
          >
            <Icon name="sync_alt" size="md" />
          </IconButton>

          {/* Destination Input */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              borderRight: '1px solid #e5e7eb',
              paddingRight: '8px',
            }}
          >
            <Box
              component="label"
              sx={{
                position: 'absolute',
                top: '8px',
                left: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#616f89',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
              }}
            >
              To
            </Box>
            <TextField
              value={formValues.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  paddingTop: '24px',
                  paddingBottom: '8px',
                  paddingX: '16px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111318',
                },
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  backgroundColor: 'transparent',
                  border: 'none',
                },
              }}
            />
          </Box>

          {/* Departure Date Input */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              borderRight: '1px solid #e5e7eb',
              paddingRight: '8px',
            }}
          >
            <Box
              component="label"
              sx={{
                position: 'absolute',
                top: '8px',
                left: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#616f89',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
              }}
            >
              Depart
            </Box>
            <TextField
              value={formValues.departureDate}
              onChange={(e) => handleInputChange('departureDate', e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  paddingTop: '24px',
                  paddingBottom: '8px',
                  paddingX: '16px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111318',
                },
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  backgroundColor: 'transparent',
                  border: 'none',
                },
              }}
            />
          </Box>

          {/* Return Date Input */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              borderRight: '1px solid #e5e7eb',
              paddingRight: '8px',
            }}
          >
            <Box
              component="label"
              sx={{
                position: 'absolute',
                top: '8px',
                left: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#616f89',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
              }}
            >
              Return
            </Box>
            <TextField
              value={formValues.returnDate || ''}
              onChange={(e) => handleInputChange('returnDate', e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  paddingTop: '24px',
                  paddingBottom: '8px',
                  paddingX: '16px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111318',
                },
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  backgroundColor: 'transparent',
                  border: 'none',
                },
              }}
            />
          </Box>

          {/* Travelers Input */}
          <Box
            sx={{
              flex: 0.8,
              position: 'relative',
              paddingRight: '8px',
            }}
          >
            <Box
              component="label"
              sx={{
                position: 'absolute',
                top: '8px',
                left: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#616f89',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
              }}
            >
              Travelers
            </Box>
            <TextField
              value={`${formValues.passengers} • ${formValues.cabinClass}`}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                readOnly: true,
                sx: {
                  paddingTop: '24px',
                  paddingBottom: '8px',
                  paddingX: '16px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111318',
                  cursor: 'pointer',
                },
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  backgroundColor: 'transparent',
                  border: 'none',
                },
              }}
            />
          </Box>

          {/* Search Button */}
          <IconButton
            onClick={handleSearch}
            sx={{
              backgroundColor: '#135bec',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.25)',
              '&:hover': {
                backgroundColor: '#0e4bce',
                boxShadow: '0 10px 20px -3px rgba(19, 91, 236, 0.3)',
              },
            }}
          >
            <Icon name="search" size="md" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ResultsHeader;
