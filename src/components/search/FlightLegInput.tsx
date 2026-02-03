import { Box, useMediaQuery, useTheme } from '@mui/material';
import type { FlightLeg, Airport } from '../../types';
import AirportAutocomplete from './AirportAutocomplete';
import DatePickerInput from './DatePickerInput';
import Icon from '../common/Icon';

interface FlightLegInputProps {
  leg: FlightLeg;
  legNumber: number; // 1, 2, 3...
  canRemove: boolean; // false if only 2 legs exist
  onUpdate: (leg: FlightLeg) => void;
  onRemove: () => void;
  minDate?: Date; // for validation (can't be before previous leg's date)
  variant?: 'desktop' | 'mobile';
}

function FlightLegInput({
  leg,
  legNumber,
  canRemove,
  onUpdate,
  onRemove,
  minDate,
  variant = 'desktop',
}: FlightLegInputProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const effectiveVariant = variant === 'mobile' || isMobile ? 'mobile' : 'desktop';

  const handleOriginChange = (airport: Airport | null) => {
    onUpdate({ ...leg, origin: airport });
  };

  const handleDestinationChange = (airport: Airport | null) => {
    onUpdate({ ...leg, destination: airport });
  };

  const handleDateChange = (date: Date | null) => {
    onUpdate({ ...leg, departureDate: date });
  };

  // Get icon name for flight number
  const getNumberIcon = () => {
    switch (legNumber) {
      case 1:
        return 'looks_one';
      case 2:
        return 'looks_two';
      case 3:
        return 'looks_3';
      case 4:
        return 'looks_4';
      case 5:
        return 'looks_5';
      default:
        return 'looks_one';
    }
  };

  if (effectiveVariant === 'mobile') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#135bec',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Flight {legNumber}
          </Box>
          {canRemove && (
            <Box
              component="button"
              onClick={onRemove}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                color: '#cbd5e1',
                transition: 'color 150ms',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                '&:hover': {
                  color: '#ef4444',
                },
              }}
            >
              <Icon name="close" size="md" />
            </Box>
          )}
        </Box>

        {/* From */}
        <AirportAutocomplete
          label="From"
          value={leg.origin}
          onChange={handleOriginChange}
          variant="mobile"
          placeholder="City or Airport"
          borderRadius="top"
        />

        {/* To */}
        <Box sx={{ mt: '-12px' }}>
          <AirportAutocomplete
            label="To"
            value={leg.destination}
            onChange={handleDestinationChange}
            variant="mobile"
            placeholder="City or Airport"
            borderRadius="bottom"
          />
        </Box>

        {/* Departure Date */}
        <DatePickerInput
          label="Departure Date"
          value={leg.departureDate}
          onChange={handleDateChange}
          minDate={minDate || new Date()}
          variant="mobile"
          placeholder="Add date"
        />
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '4px',
        }}
      >
        <Box
          component="h4"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#111318',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
          }}
        >
          <Icon name={getNumberIcon()} className="flight-number-icon" />
          <style>
            {`
              .flight-number-icon {
                color: #135bec;
                font-size: 20px !important;
              }
            `}
          </style>
          Flight {legNumber}
        </Box>
        {canRemove && (
          <Box
            component="button"
            onClick={onRemove}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#9ca3af',
              transition: 'all 150ms',
              padding: '4px 8px',
              borderRadius: '6px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              '&:hover': {
                color: '#ef4444',
                backgroundColor: '#fef2f2',
              },
            }}
          >
            <Icon name="delete" size="md" />
            <Box
              component="span"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Remove
            </Box>
          </Box>
        )}
      </Box>

      {/* Inputs row: 3-column grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(12, 1fr)',
          },
          gap: '16px',
        }}
      >
        {/* From: col-span-4 */}
        <Box
          sx={{
            gridColumn: { xs: 'span 1', lg: 'span 4' },
          }}
        >
          <AirportAutocomplete
            label="From"
            value={leg.origin}
            onChange={handleOriginChange}
            variant="desktop"
            placeholder="City or Airport"
          />
        </Box>

        {/* To: col-span-4 */}
        <Box
          sx={{
            gridColumn: { xs: 'span 1', lg: 'span 4' },
          }}
        >
          <AirportAutocomplete
            label="To"
            value={leg.destination}
            onChange={handleDestinationChange}
            variant="desktop"
            placeholder="City or Airport"
          />
        </Box>

        {/* Departure: col-span-4 */}
        <Box
          sx={{
            gridColumn: { xs: 'span 1', lg: 'span 4' },
          }}
        >
          <DatePickerInput
            label="Departure"
            value={leg.departureDate}
            onChange={handleDateChange}
            minDate={minDate || new Date()}
            variant="desktop"
            placeholder="Add date"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default FlightLegInput;
