import { Box, Button, Typography } from '@mui/material';
import type { FlightFilters, AirlineInfo } from '../../types';
import StopsFilter from './StopsFilter';
import PriceRangeSlider from './PriceRangeSlider';
import DepartureTimeFilter from './DepartureTimeFilter';
import AirlinesFilter from './AirlinesFilter';

interface FilterSidebarProps {
  filters: FlightFilters;
  airlines: AirlineInfo[];
  priceRange: { min: number; max: number };
  stopPrices?: {
    direct?: number;
    oneStop?: number;
    twoPlus?: number;
  };
  onFilterChange: (filterType: keyof FlightFilters, value: unknown) => void;
  onResetFilters: () => void;
}

/**
 * Calculate the number of active filters
 */
function getActiveFilterCount(filters: FlightFilters, priceRange: { min: number; max: number }): number {
  let count = 0;

  // Count stops filter (active if not all selected or not empty)
  if (filters.stops.length > 0 && filters.stops.length < 3) {
    count++;
  }

  // Count price range filter (active if different from full range)
  if (
    filters.priceRange.min !== priceRange.min ||
    filters.priceRange.max !== priceRange.max
  ) {
    count++;
  }

  // Count departure time filter (active if any selected)
  if (filters.departureTime.length > 0 && filters.departureTime.length < 3) {
    count++;
  }

  // Count airlines filter (active if any selected)
  if (filters.airlines.length > 0) {
    count++;
  }

  return count;
}

function FilterSidebar({
  filters,
  airlines,
  priceRange,
  stopPrices,
  onFilterChange,
  onResetFilters,
}: FilterSidebarProps) {
  const activeFilterCount = getActiveFilterCount(filters, priceRange);

  return (
    <Box
      component="aside"
      sx={{
        display: { xs: 'none', lg: 'flex' },
        width: '288px',
        flexDirection: 'column',
        gap: '24px',
        height: 'fit-content',
        position: 'sticky',
        top: '96px',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography
            component="h3"
            sx={{
              fontSize: '1.125rem',
              fontWeight: 700,
            }}
          >
            Filters
          </Typography>

          {/* Active filter count badge */}
          {activeFilterCount > 0 && (
            <Box
              sx={{
                minWidth: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#135bec',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                paddingX: '6px',
              }}
            >
              {activeFilterCount}
            </Box>
          )}
        </Box>

        <Button
          onClick={onResetFilters}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#135bec',
            textTransform: 'none',
            padding: 0,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          Reset all
        </Button>
      </Box>

      {/* Filter Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Stops Filter */}
        <StopsFilter
          selectedStops={[...filters.stops]}
          onChange={(stops) => onFilterChange('stops', stops)}
          stopPrices={stopPrices}
          variant="desktop"
        />

        {/* Price Range Slider */}
        <PriceRangeSlider
          min={priceRange.min}
          max={priceRange.max}
          value={[filters.priceRange.min, filters.priceRange.max]}
          onChange={(range) => onFilterChange('priceRange', { min: range[0], max: range[1] })}
          variant="desktop"
        />

        {/* Departure Time Filter */}
        <DepartureTimeFilter
          selectedTimes={[...filters.departureTime]}
          onChange={(times) => onFilterChange('departureTime', times)}
          variant="desktop"
        />

        {/* Airlines Filter */}
        <AirlinesFilter
          airlines={airlines}
          selectedAirlines={[...filters.airlines]}
          onChange={(airlineCodes) => onFilterChange('airlines', airlineCodes)}
          variant="desktop"
        />
      </Box>
    </Box>
  );
}

export default FilterSidebar;
