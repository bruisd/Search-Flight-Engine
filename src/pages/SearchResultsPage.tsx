import { useEffect, useState, useRef } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import {
  Header,
  ErrorBoundary,
  FilterSidebarSkeleton,
  PriceChartSkeleton,
} from '../components/common';
import { PriceTrendChart } from '../components/charts';
import { FlightList } from '../components/results';
import type { SortOption } from '../components/results/SortTabs';
import {
  FilterSidebar,
  FilterFAB,
  FilterBottomSheet,
} from '../components/filters';
import type { Flight } from '../types';

/**
 * Calculate the lowest price for each stop category
 */
function calculateStopPrices(flights: Flight[]) {
  const direct = flights.filter((f) => f.stops === 0);
  const oneStop = flights.filter((f) => f.stops === 1);
  const twoPlus = flights.filter((f) => f.stops >= 2);

  return {
    direct: direct.length > 0 ? Math.min(...direct.map((f) => f.price)) : undefined,
    oneStop: oneStop.length > 0 ? Math.min(...oneStop.map((f) => f.price)) : undefined,
    twoPlus: twoPlus.length > 0 ? Math.min(...twoPlus.map((f) => f.price)) : undefined,
  };
}

/**
 * Calculate sort statistics from flights
 */
function calculateSortStats(flights: Flight[]) {
  if (flights.length === 0) {
    return { cheapestPrice: undefined, fastestDuration: undefined };
  }

  return {
    cheapestPrice: Math.min(...flights.map((f) => f.price)),
    fastestDuration: Math.min(...flights.map((f) => f.duration)),
  };
}

/**
 * Count active filters
 */
function getActiveFilterCount(
  filters: {
    stops: number[];
    priceRange: [number, number];
    airlines: string[];
    departureTime: string[];
  },
  priceRange: { min: number; max: number }
): number {
  let count = 0;

  // Stops filter active if not empty and not all options
  if (filters.stops.length > 0 && filters.stops.length < 3) {
    count++;
  }

  // Price range active if different from full range
  if (filters.priceRange[0] !== priceRange.min || filters.priceRange[1] !== priceRange.max) {
    count++;
  }

  // Departure time active if not empty and not all options
  if (filters.departureTime.length > 0 && filters.departureTime.length < 3) {
    count++;
  }

  // Airlines active if any selected
  if (filters.airlines.length > 0) {
    count++;
  }

  return count;
}

function SearchResultsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filterBottomSheetOpen, setFilterBottomSheetOpen] = useState(false);

  // Get search context
  const {
    searchParams: contextSearchParams,
    setSearchParams,
    allFlights,
    filteredFlights,
    airlines,
    priceRange,
    filters,
    isLoading,
    isError,
    error,
    sortBy,
    updateFilter,
    resetFilters,
    setSortBy,
  } = useSearch();

  // Track last processed URL params to prevent infinite loops
  const lastParamsRef = useRef<string>('');

  // Parse URL params and set search params on mount
  useEffect(() => {
    // Convert to string for primitive comparison (prevents object reference issues)
    const paramString = searchParams.toString();

    // Skip if we've already processed these exact params
    if (paramString === lastParamsRef.current) {
      return;
    }

    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const passengers = searchParams.get('passengers');
    const cabinClass = searchParams.get('cabinClass');
    const tripType = searchParams.get('tripType');

    // Validate required params
    if (!origin || !destination || !departureDate) {
      console.error('Missing required search parameters');
      navigate('/');
      return;
    }

    // Mark these params as processed
    lastParamsRef.current = paramString;

    // Set search params in context (triggers API call)
    setSearchParams({
      origin,
      destination,
      departureDate,
      returnDate: returnDate || undefined,
      adults: passengers ? parseInt(passengers, 10) : 1,
      travelClass: cabinClass || 'Economy',
      tripType: (tripType as 'one-way' | 'round-trip' | 'multi-city') || 'round-trip',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), navigate]);
  // Note: setSearchParams is intentionally NOT in deps to prevent loops

  // Calculate derived data with null checks
  const safeAllFlights = allFlights || [];
  const safeFilteredFlights = filteredFlights || [];
  const safeAirlines = airlines || [];
  const stopPrices = calculateStopPrices(safeAllFlights);
  const sortStats = calculateSortStats(safeFilteredFlights);
  const activeFilterCount = getActiveFilterCount(filters, priceRange);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof filters, value: unknown) => {
    // Convert priceRange object to tuple if needed
    if (filterType === 'priceRange' && value && typeof value === 'object' && 'min' in value && 'max' in value) {
      const range = value as { min: number; max: number };
      updateFilter('priceRange', [range.min, range.max]);
    } else {
      updateFilter(filterType, value as never);
    }
  };

  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
  };

  // Handle flight selection
  const handleSelectFlight = (flight: Flight) => {
    console.log('Selected flight:', flight);
    // TODO: Navigate to booking page
  };

  // Don't render until we have search params
  if (!contextSearchParams) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f6f6f8',
        }}
      >
        {/* Header */}
        <Header transparent={false} />

        {/* Main Content */}
        <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          maxWidth: '1280px',
          width: '100%',
          marginX: 'auto',
          padding: { xs: '16px', lg: '32px' },
          gap: { xs: '20px', lg: '32px' },
        }}
      >
        {/* Filter Sidebar (Desktop only) */}
        {!isMobile && (
          <>
            {isLoading ? (
              <FilterSidebarSkeleton />
            ) : (
              <FilterSidebar
                filters={{
                  stops: filters.stops as readonly number[],
                  priceRange: { min: filters.priceRange[0], max: filters.priceRange[1] },
                  airlines: filters.airlines as readonly string[],
                  departureTime: filters.departureTime as readonly ('morning' | 'afternoon' | 'evening')[],
                }}
                airlines={safeAirlines}
                priceRange={priceRange}
                stopPrices={stopPrices}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
              />
            )}
          </>
        )}

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '20px', lg: '24px' },
            maxWidth: { xs: '100%', lg: 'calc(100% - 320px)' },
          }}
        >
          {/* Price Trend Chart */}
          {isLoading ? (
            <PriceChartSkeleton variant={isMobile ? 'mobile' : 'desktop'} />
          ) : (
            <PriceTrendChart
              flights={safeFilteredFlights}
              variant={isMobile ? 'mobile' : 'desktop'}
            />
          )}

          {/* Flight List */}
          <FlightList
            flights={safeFilteredFlights}
            totalCount={safeFilteredFlights.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onSelectFlight={handleSelectFlight}
            isLoading={isLoading}
            isError={isError}
            error={error}
            sortStats={sortStats}
          />
        </Box>
      </Box>

      {/* Mobile Filter System */}
      {isMobile && (
        <>
          {/* Floating Action Button */}
          <FilterFAB
            onClick={() => setFilterBottomSheetOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {/* Filter Bottom Sheet */}
          <FilterBottomSheet
            open={filterBottomSheetOpen}
            onClose={() => setFilterBottomSheetOpen(false)}
            filters={{
              stops: filters.stops as readonly number[],
              priceRange: { min: filters.priceRange[0], max: filters.priceRange[1] },
              airlines: filters.airlines as readonly string[],
              departureTime: filters.departureTime as readonly ('morning' | 'afternoon' | 'evening')[],
            }}
            airlines={safeAirlines}
            priceRange={priceRange}
            stopPrices={stopPrices}
            filteredCount={safeFilteredFlights.length}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
          />
        </>
      )}
      </Box>
    </ErrorBoundary>
  );
}

export default SearchResultsPage;
