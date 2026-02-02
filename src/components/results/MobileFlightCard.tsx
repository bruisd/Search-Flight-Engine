import { Box, Button, Typography } from '@mui/material';
import type { Flight } from '../../types';
import { formatPrice, formatTime24 } from '../../utils/formatters';
import Icon from '../common/Icon';
import FlightTimeline from './FlightTimeline';

interface MobileFlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  isBestValue?: boolean;
  seatsRemaining?: number;
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

function MobileFlightCard({
  flight,
  onSelect,
  isBestValue = false,
  seatsRemaining,
}: MobileFlightCardProps) {
  // Format times (24h format for mobile)
  const departureTimeFormatted = formatTime24(flight.departureTime);
  const arrivalTimeFormatted = formatTime24(flight.arrivalTime);

  // Format price
  const priceFormatted = formatPrice(flight.price);

  // Aircraft and cabin class info
  const aircraftInfo = `${flight.aircraft} • ${flight.cabinClass}`;

  // Airline initials and color for fallback
  const airlineInitials = getAirlineInitials(flight.airline.name);
  const airlineColor = getAirlineColor(flight.airline.code);

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #f3f4f6',
        overflow: 'hidden',
      }}
    >
      {/* Best Value Header Bar */}
      {isBestValue && (
        <Box
          sx={{
            backgroundColor: 'rgba(19, 91, 236, 0.1)',
            paddingX: '16px',
            paddingY: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Best Value Badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Icon name="stars" className="best-value-icon" />
            <style>
              {`
                .best-value-icon {
                  font-size: 14px !important;
                  color: #135bec;
                }
              `}
            </style>
            <Typography
              sx={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 700,
                color: '#135bec',
              }}
            >
              Best Value
            </Typography>
          </Box>

          {/* Seats Remaining */}
          {seatsRemaining !== undefined && (
            <Typography
              sx={{
                fontSize: '10px',
                color: '#6b7280',
                fontWeight: 500,
              }}
            >
              Remaining: {seatsRemaining} seats
            </Typography>
          )}
        </Box>
      )}

      {/* Card Content */}
      <Box
        sx={{
          padding: '16px',
          paddingTop: isBestValue ? '12px' : '16px',
        }}
      >
        {/* Top Row: Airline Info + Price */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px',
          }}
        >
          {/* Airline Info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Airline Logo */}
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
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />

            {/* Airline Details */}
            <Box>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {flight.airline.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                }}
              >
                {aircraftInfo}
              </Typography>
            </Box>
          </Box>

          {/* Price */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              {priceFormatted}
            </Typography>
          </Box>
        </Box>

        {/* Flight Path Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            position: 'relative',
          }}
        >
          {/* Departure */}
          <Box
            sx={{
              textAlign: 'center',
              width: '64px',
            }}
          >
            <Typography
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
              }}
            >
              {departureTimeFormatted}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#9ca3af',
              }}
            >
              {flight.origin}
            </Typography>
          </Box>

          {/* FlightTimeline - Mobile Variant */}
          <FlightTimeline
            duration={flight.duration}
            stops={flight.stops}
            stopLocations={flight.stopLocations}
            variant="mobile"
          />

          {/* Arrival */}
          <Box
            sx={{
              textAlign: 'center',
              width: '64px',
            }}
          >
            <Typography
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
              }}
            >
              {arrivalTimeFormatted}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#9ca3af',
              }}
            >
              {flight.destination}
            </Typography>
          </Box>
        </Box>

        {/* Select Button */}
        <Button
          variant={isBestValue ? 'contained' : 'outlined'}
          onClick={() => onSelect(flight)}
          sx={{
            width: '100%',
            paddingY: '10px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 700,
            textTransform: 'none',
            ...(isBestValue
              ? {
                  backgroundColor: '#135bec',
                  color: '#ffffff',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: '#0e4bce',
                  },
                }
              : {
                  border: '2px solid #135bec',
                  color: '#135bec',
                  '&:hover': {
                    backgroundColor: '#135bec',
                    color: '#ffffff',
                    border: '2px solid #135bec',
                  },
                }),
          }}
        >
          Select Flight
        </Button>
      </Box>
    </Box>
  );
}

export default MobileFlightCard;
