import { Box, Button, Typography } from '@mui/material';
import type { Flight } from '../../types';
import { formatPrice, formatTime } from '../../utils/formatters';
import FlightTimeline from './FlightTimeline';

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  variant?: 'default' | 'bestValue';
  isFirstCard?: boolean; // For styling the first card differently
}

/**
 * Get airline initials for fallback logo
 */
function getAirlineInitials(name: string): string {
  const words = name.split(' ').filter((w) => w.length > 0);
  if (words.length >= 2) {
    return words[0][0] + words[1][0];
  }
  return words[0]?.substring(0, 2) || 'AA';
}

/**
 * Generate a color based on airline code for fallback
 */
function getAirlineColor(code: string): string {
  const colors = [
    '#135bec', // primary blue
    '#16a34a', // green
    '#dc2626', // red
    '#7c3aed', // purple
    '#ea580c', // orange
    '#0891b2', // cyan
  ];
  const index = code.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Check if arrival is next day
 */
function isNextDay(departureTime: string, arrivalTime: string): boolean {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  const departureDay = departure.toISOString().split('T')[0];
  const arrivalDay = arrival.toISOString().split('T')[0];
  return arrivalDay !== departureDay;
}

function FlightCard({
  flight,
  onSelect,
  variant = 'default',
  isFirstCard = false,
}: FlightCardProps) {
  const isBestValue = variant === 'bestValue' || flight.isBestValue;
  const nextDay = isNextDay(flight.departureTime, flight.arrivalTime);

  // Format times
  const departureTimeFormatted = formatTime(flight.departureTime);
  const arrivalTimeFormatted = formatTime(flight.arrivalTime);

  // Format price
  const priceFormatted = formatPrice(flight.price);

  // Check for multiple airlines (if segments have different airlines)
  const uniqueAirlines = new Set(flight.segments.map((seg) => seg.airline));
  const hasMultipleAirlines = uniqueAirlines.size > 1;

  // Airline initials and color for fallback
  const airlineInitials = getAirlineInitials(flight.airline.name);
  const airlineColor = getAirlineColor(flight.airline.code);

  return (
    <Box
      onClick={() => onSelect(flight)}
      sx={{
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: isBestValue
          ? '1px solid #e5e7eb'
          : '1px solid #e5e7eb',
        borderLeft: isBestValue ? '4px solid #16a34a' : '1px solid #e5e7eb',
        padding: '20px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: '#135bec',
          borderLeft: isBestValue ? '4px solid #16a34a' : '1px solid #135bec',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      {/* Best Value Badge */}
      {isBestValue && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: '#16a34a',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 700,
            paddingX: '12px',
            paddingY: '4px',
            borderBottomLeftRadius: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Best Value
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* Airline Info */}
        <Box
          sx={{
            width: { xs: '100%', md: '128px' },
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Airline Logo or Fallback */}
          {hasMultipleAirlines ? (
            // Multiple airlines - show overlapping logos
            <Box sx={{ display: 'flex', marginLeft: '8px' }}>
              <Box
                sx={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: airlineColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '2px solid #ffffff',
                  zIndex: 10,
                  marginLeft: '-8px',
                }}
              >
                {airlineInitials}
              </Box>
              <Box
                sx={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '2px solid #ffffff',
                  marginLeft: '-8px',
                }}
              >
                +
              </Box>
            </Box>
          ) : (
            // Single airline - try image, fallback to circle
            <Box
              component="img"
              src={flight.airline.logo}
              alt={flight.airline.name}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                // Replace with fallback circle
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.style.width = '40px';
                  fallback.style.height = '40px';
                  fallback.style.borderRadius = '50%';
                  fallback.style.backgroundColor = airlineColor;
                  fallback.style.display = 'flex';
                  fallback.style.alignItems = 'center';
                  fallback.style.justifyContent = 'center';
                  fallback.style.color = '#ffffff';
                  fallback.style.fontSize = '14px';
                  fallback.style.fontWeight = '700';
                  fallback.textContent = airlineInitials;
                  parent.appendChild(fallback);
                }
              }}
              sx={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
              }}
            />
          )}

          {/* Airline Name */}
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#6b7280',
            }}
          >
            {hasMultipleAirlines ? 'Multiple' : flight.airline.name}
          </Typography>
        </Box>

        {/* Flight Details - 3 Column Grid */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {/* Departure */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#111318',
              }}
            >
              {departureTimeFormatted}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontWeight: 500,
              }}
            >
              {flight.origin}
            </Typography>
          </Box>

          {/* Timeline */}
          <FlightTimeline
            duration={flight.duration}
            stops={flight.stops}
            stopLocations={flight.stopLocations}
            variant="desktop"
          />

          {/* Arrival */}
          <Box sx={{ textAlign: 'left' }}>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#111318',
              }}
            >
              {arrivalTimeFormatted}
            </Typography>
            <Box
              component="p"
              sx={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontWeight: 500,
                margin: 0,
              }}
            >
              {flight.destination}
              {nextDay && (
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    fontWeight: 700,
                    marginLeft: '4px',
                  }}
                >
                  +1
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Price & Action */}
        <Box
          sx={{
            width: { xs: '100%', md: 'auto' },
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            alignItems: { xs: 'center', md: 'flex-end' },
            justifyContent: { xs: 'space-between', md: 'center' },
            gap: '8px',
            borderTop: { xs: '1px solid #f3f4f6', md: 'none' },
            borderLeft: { xs: 'none', md: '1px solid #f3f4f6' },
            paddingTop: { xs: '16px', md: 0 },
            paddingLeft: { xs: 0, md: '24px' },
          }}
        >
          {/* Price */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#111318',
              }}
            >
              {priceFormatted}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: '#9ca3af',
              }}
            >
              {flight.currency === 'USD' ? 'Round trip' : 'Total'}
            </Typography>
          </Box>

          {/* Select Button */}
          <Button
            variant={isFirstCard ? 'contained' : 'outlined'}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(flight);
            }}
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              paddingY: '10px',
              paddingX: '24px',
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: isFirstCard ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
              ...(isFirstCard
                ? {
                    backgroundColor: '#135bec',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#0e4bce',
                    },
                  }
                : {
                    backgroundColor: 'rgba(19, 91, 236, 0.1)',
                    color: '#135bec',
                    borderColor: '#135bec',
                    '&:hover': {
                      backgroundColor: 'rgba(19, 91, 236, 0.2)',
                      borderColor: '#0e4bce',
                    },
                  }),
            }}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default FlightCard;
