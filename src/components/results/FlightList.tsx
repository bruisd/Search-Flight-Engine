import { useState } from 'react';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { Flight } from '../../types';
import FlightCard from './FlightCard';
import MobileFlightCard from './MobileFlightCard';
import SortTabs, { type SortOption } from './SortTabs';
import { FlightCardSkeleton } from '../common';
import { EmptyState } from '../common';
import Icon from '../common/Icon';

interface FlightListProps {
  flights: Flight[];
  totalCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSelectFlight: (flight: Flight) => void;
  isLoading: boolean;
  sortStats?: {
    cheapestPrice?: number;
    fastestDuration?: number;
  };
}

const FLIGHTS_PER_PAGE = 10;

function FlightList({
  flights,
  totalCount,
  sortBy,
  onSortChange,
  onSelectFlight,
  isLoading,
  sortStats,
}: FlightListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visibleCount, setVisibleCount] = useState(FLIGHTS_PER_PAGE);

  // Calculate visible flights
  const visibleFlights = flights.slice(0, visibleCount);
  const hasMoreFlights = visibleCount < flights.length;

  // Handle show more
  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + FLIGHTS_PER_PAGE, flights.length));
  };

  // Loading state
  if (isLoading) {
    return (
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            Searching flights...
          </Typography>

          <SortTabs
            value={sortBy}
            onChange={onSortChange}
            stats={sortStats}
            variant={isMobile ? 'mobile' : 'desktop'}
          />
        </Box>

        {/* Skeleton cards */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <FlightCardSkeleton key={index} variant={isMobile ? 'mobile' : 'desktop'} />
          ))}
        </Box>
      </Box>
    );
  }

  // Empty state
  if (flights.length === 0) {
    return (
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            0 flights found
          </Typography>

          <SortTabs
            value={sortBy}
            onChange={onSortChange}
            stats={sortStats}
            variant={isMobile ? 'mobile' : 'desktop'}
          />
        </Box>

        {/* Empty state */}
        <EmptyState
          title="No flights found"
          subtitle="Try adjusting your search filters or dates to see more results."
          icon="flight_takeoff"
          action={{
            label: 'Clear Filters',
            onClick: () => {
              // This would be connected to the filter reset function
              console.log('Clear filters clicked');
            },
          }}
        />
      </Box>
    );
  }

  // Results view
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 700,
          }}
        >
          {totalCount} {totalCount === 1 ? 'flight' : 'flights'} found
        </Typography>

        <SortTabs
          value={sortBy}
          onChange={onSortChange}
          stats={sortStats}
          variant={isMobile ? 'mobile' : 'desktop'}
        />
      </Box>

      {/* Flight cards */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {visibleFlights.map((flight, index) => {
          const isFirstCard = index === 0;
          const isBestValue = flight.isBestValue;

          return isMobile ? (
            <MobileFlightCard
              key={flight.id}
              flight={flight}
              onSelect={onSelectFlight}
              isBestValue={isBestValue}
              seatsRemaining={isBestValue ? 4 : undefined}
            />
          ) : (
            <FlightCard
              key={flight.id}
              flight={flight}
              onSelect={onSelectFlight}
              variant={isBestValue ? 'bestValue' : 'default'}
              isFirstCard={isFirstCard}
            />
          );
        })}
      </Box>

      {/* Show more button */}
      {hasMoreFlights && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingY: '24px',
          }}
        >
          <Button
            onClick={handleShowMore}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#135bec',
              fontWeight: 700,
              paddingX: '24px',
              paddingY: '12px',
              borderRadius: '9999px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(19, 91, 236, 0.05)',
              },
            }}
          >
            Show more flights
            <Icon name="expand_more" className="expand-icon" />
            <style>
              {`
                .expand-icon {
                  font-size: 20px !important;
                }
              `}
            </style>
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default FlightList;
