import { Box, Button, SwipeableDrawer, Typography } from '@mui/material';
import type { FlightFilters, AirlineInfo } from '../../types';
import StopsFilter from './StopsFilter';
import PriceRangeSlider from './PriceRangeSlider';
import DepartureTimeFilter from './DepartureTimeFilter';
import AirlinesFilter from './AirlinesFilter';

interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  filters: FlightFilters;
  airlines: AirlineInfo[];
  priceRange: { min: number; max: number };
  stopPrices?: {
    direct?: number;
    oneStop?: number;
    twoPlus?: number;
  };
  filteredCount: number;
  onFilterChange: (filterType: keyof FlightFilters, value: unknown) => void;
  onResetFilters: () => void;
}

function FilterBottomSheet({
  open,
  onClose,
  filters,
  airlines,
  priceRange,
  stopPrices,
  filteredCount,
  onFilterChange,
  onResetFilters,
}: FilterBottomSheetProps) {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}} // Required by SwipeableDrawer
      disableSwipeToOpen
      sx={{
        '& .MuiDrawer-paper': {
          height: '90vh',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Drag Handle */}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: '24px',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '12px',
            paddingBottom: '4px',
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              height: '6px',
              width: '48px',
              borderRadius: '9999px',
              backgroundColor: '#d1d5db',
            }}
          />
        </Box>

        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingX: '24px',
            paddingY: '16px',
            flexShrink: 0,
            borderBottom: '1px solid #f0f2f4',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            Filters
          </Typography>

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

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '96px', // Space for sticky footer
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          {/* Stops Filter */}
          <Box sx={{ marginY: '24px' }}>
            <StopsFilter
              selectedStops={[...filters.stops]}
              onChange={(stops) => onFilterChange('stops', stops)}
              stopPrices={stopPrices}
              variant="mobile"
            />
          </Box>

          {/* Divider */}
          <Box
            sx={{
              height: '1px',
              width: '100%',
              backgroundColor: '#f0f2f4',
              marginY: '24px',
            }}
          />

          {/* Price Range Slider */}
          <Box sx={{ marginY: '24px' }}>
            <PriceRangeSlider
              min={priceRange.min}
              max={priceRange.max}
              value={[filters.priceRange.min, filters.priceRange.max]}
              onChange={(range) => onFilterChange('priceRange', { min: range[0], max: range[1] })}
              variant="mobile"
            />
          </Box>

          {/* Divider */}
          <Box
            sx={{
              height: '1px',
              width: '100%',
              backgroundColor: '#f0f2f4',
              marginY: '24px',
            }}
          />

          {/* Departure Time Filter */}
          <Box sx={{ marginY: '24px' }}>
            <DepartureTimeFilter
              selectedTimes={[...filters.departureTime]}
              onChange={(times) => onFilterChange('departureTime', times)}
              variant="mobile"
            />
          </Box>

          {/* Divider */}
          <Box
            sx={{
              height: '1px',
              width: '100%',
              backgroundColor: '#f0f2f4',
              marginY: '24px',
            }}
          />

          {/* Airlines Filter */}
          <Box sx={{ marginY: '24px' }}>
            <AirlinesFilter
              airlines={airlines}
              selectedAirlines={[...filters.airlines]}
              onChange={(airlineCodes) => onFilterChange('airlines', airlineCodes)}
              variant="mobile"
            />
          </Box>
        </Box>

        {/* Sticky Footer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid #f0f2f4',
            backgroundColor: '#ffffff',
            padding: '16px',
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '12px',
              backgroundColor: '#135bec',
              paddingY: '16px',
              fontWeight: 700,
              color: '#ffffff',
              textTransform: 'none',
              boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.3), 0 4px 6px -2px rgba(19, 91, 236, 0.2)',
              '&:hover': {
                backgroundColor: '#0e4bce',
              },
            }}
          >
            Show {filteredCount} {filteredCount === 1 ? 'flight' : 'flights'}
          </Button>

          {/* Safe area padding */}
          <Box sx={{ height: '16px', width: '100%' }} />
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}

export default FilterBottomSheet;
