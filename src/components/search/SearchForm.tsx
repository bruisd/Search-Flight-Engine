import { useState } from 'react';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TripTypeToggle from './TripTypeToggle';
import AirportAutocomplete, { Airport } from './AirportAutocomplete';
import SwapButton from './SwapButton';
import DateRangePicker from './DateRangePicker';
import TravelersSelect from './TravelersSelect';
import Icon from '../common/Icon';

export interface SearchParams {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: number;
  cabinClass: string;
  tripType: 'round-trip' | 'one-way' | 'multi-city';
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: Partial<SearchParams>;
}

function SearchForm({ onSearch, initialParams }: SearchFormProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>(
    initialParams?.tripType || 'round-trip'
  );
  const [origin, setOrigin] = useState<Airport | null>(initialParams?.origin || null);
  const [destination, setDestination] = useState<Airport | null>(
    initialParams?.destination || null
  );
  const [departureDate, setDepartureDate] = useState<Date | null>(
    initialParams?.departureDate || null
  );
  const [returnDate, setReturnDate] = useState<Date | null>(
    initialParams?.returnDate || null
  );
  const [passengers, setPassengers] = useState<number>(initialParams?.passengers || 1);
  const [cabinClass, setCabinClass] = useState<string>(
    initialParams?.cabinClass || 'Economy'
  );

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};

    if (!origin) newErrors.origin = true;
    if (!destination) newErrors.destination = true;
    if (!departureDate) newErrors.departureDate = true;
    if (tripType === 'round-trip' && !returnDate) newErrors.returnDate = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (!validateForm()) {
      return;
    }

    const searchParams: SearchParams = {
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'one-way' ? null : returnDate,
      passengers,
      cabinClass,
      tripType,
    };

    onSearch(searchParams);

    // Navigate to search results with query params
    const queryParams = new URLSearchParams();
    if (origin) queryParams.set('origin', origin.code);
    if (destination) queryParams.set('destination', destination.code);
    if (departureDate) queryParams.set('departureDate', departureDate.toISOString());
    if (returnDate && tripType === 'round-trip') {
      queryParams.set('returnDate', returnDate.toISOString());
    }
    queryParams.set('passengers', passengers.toString());
    queryParams.set('cabinClass', cabinClass);
    queryParams.set('tripType', tripType);

    navigate(`/search?${queryParams.toString()}`);
  };

  // Desktop Layout
  if (isDesktop) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: '1152px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f0f2f4',
          padding: { md: '24px', lg: '32px' },
        }}
      >
        {/* Header Row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <TripTypeToggle value={tripType} onChange={setTripType} />
          <TravelersSelect
            passengers={passengers}
            cabinClass={cabinClass}
            onPassengersChange={setPassengers}
            onCabinClassChange={setCabinClass}
            variant="desktop"
          />
        </Box>

        {/* Input Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '12px',
            position: 'relative',
          }}
        >
          {/* Origin */}
          <Box sx={{ gridColumn: 'span 3', position: 'relative' }}>
            <AirportAutocomplete
              label="From"
              icon="flight_takeoff"
              value={origin}
              onChange={setOrigin}
              variant="desktop"
            />
            {errors.origin && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  border: '2px solid #ef4444',
                  borderRadius: '12px',
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>

          {/* Destination */}
          <Box sx={{ gridColumn: 'span 3', position: 'relative' }}>
            <AirportAutocomplete
              label="To"
              icon="flight_land"
              value={destination}
              onChange={setDestination}
              variant="desktop"
            />
            {errors.destination && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  border: '2px solid #ef4444',
                  borderRadius: '12px',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Swap Button - Positioned between origin and destination */}
            <Box
              sx={{
                position: 'absolute',
                left: '-25%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 20,
              }}
            >
              <SwapButton onClick={handleSwap} variant="horizontal" />
            </Box>
          </Box>

          {/* Date Range */}
          <Box sx={{ gridColumn: 'span 4' }}>
            <DateRangePicker
              departureDate={departureDate}
              returnDate={returnDate}
              onDepartureChange={setDepartureDate}
              onReturnChange={setReturnDate}
              isOneWay={tripType === 'one-way'}
            />
          </Box>

          {/* Search Button */}
          <Box sx={{ gridColumn: 'span 2' }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                width: '100%',
                height: '60px',
                backgroundColor: '#135bec',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: '#0e4bce',
                  transform: 'scale(1.02)',
                  boxShadow: '0 20px 25px -5px rgba(19, 91, 236, 0.4)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              <Icon name="search" size="md" className="search-icon" />
              <style>
                {`
                  .search-icon {
                    color: #ffffff;
                  }
                `}
              </style>
              Search
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // Mobile Layout
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Trip Type Toggle */}
      <Box sx={{ marginBottom: '16px' }}>
        <TripTypeToggle value={tripType} onChange={setTripType} />
      </Box>

      {/* From/To Inputs with Swap Button */}
      <Box sx={{ position: 'relative', marginBottom: '16px' }}>
        {/* Origin */}
        <AirportAutocomplete
          label="From"
          icon="flight_takeoff"
          value={origin}
          onChange={setOrigin}
          variant="mobile"
          borderRadius="top"
        />

        {/* Swap Button */}
        <Box
          sx={{
            position: 'absolute',
            top: '60px',
            right: '16px',
            zIndex: 20,
          }}
        >
          <SwapButton onClick={handleSwap} variant="vertical" />
        </Box>

        {/* Destination */}
        <Box sx={{ marginTop: '-1px' }}>
          <AirportAutocomplete
            label="To"
            icon="flight_land"
            value={destination}
            onChange={setDestination}
            variant="mobile"
            borderRadius="bottom"
          />
        </Box>
      </Box>

      {/* Date Inputs */}
      <DateRangePicker
        departureDate={departureDate}
        returnDate={returnDate}
        onDepartureChange={setDepartureDate}
        onReturnChange={setReturnDate}
        isOneWay={tripType === 'one-way'}
      />

      {/* Travelers & Class */}
      <Box sx={{ marginBottom: '16px' }}>
        <TravelersSelect
          passengers={passengers}
          cabinClass={cabinClass}
          onPassengersChange={setPassengers}
          onCabinClassChange={setCabinClass}
          variant="mobile"
        />
      </Box>

      {/* Search Button */}
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
          width: '100%',
          height: '56px',
          backgroundColor: '#135bec',
          color: '#ffffff',
          fontSize: '1.125rem',
          fontWeight: 700,
          borderRadius: '12px',
          textTransform: 'none',
          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
          '&:hover': {
            backgroundColor: '#0e4bce',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        Search Flights
      </Button>
    </Box>
  );
}

export default SearchForm;
