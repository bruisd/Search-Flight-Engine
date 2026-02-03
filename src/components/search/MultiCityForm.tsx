import { Box, useMediaQuery, useTheme } from '@mui/material';
import type { FlightLeg } from '../../types';
import FlightLegInput from './FlightLegInput';
import TravelersSelect from './TravelersSelect';
import Icon from '../common/Icon';

interface MultiCityFormProps {
  legs: FlightLeg[];
  passengers: number;
  cabinClass: string;
  onLegsChange: (legs: FlightLeg[]) => void;
  onPassengersChange: (count: number) => void;
  onCabinClassChange: (cabinClass: string) => void;
  onSearch: () => void;
}

function MultiCityForm({
  legs,
  passengers,
  cabinClass,
  onLegsChange,
  onPassengersChange,
  onCabinClassChange,
  onSearch,
}: MultiCityFormProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const addLeg = () => {
    if (legs.length >= 5) return;

    const newLeg: FlightLeg = {
      id: `leg-${Date.now()}`,
      origin: null,
      destination: null,
      departureDate: null,
    };

    onLegsChange([...legs, newLeg]);
  };

  const removeLeg = (id: string) => {
    if (legs.length <= 2) return;
    onLegsChange(legs.filter((leg) => leg.id !== id));
  };

  const updateLeg = (id: string, updatedLeg: FlightLeg) => {
    onLegsChange(legs.map((leg) => (leg.id === id ? updatedLeg : leg)));
  };

  // Get minDate for each leg (can't be before previous leg's date)
  const getMinDate = (index: number): Date | undefined => {
    if (index === 0) return new Date();
    const previousLeg = legs[index - 1];
    return previousLeg.departureDate || new Date();
  };

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Flight legs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px', mb: '32px' }}>
          {legs.map((leg, index) => (
            <FlightLegInput
              key={leg.id}
              leg={leg}
              legNumber={index + 1}
              canRemove={legs.length > 2}
              onUpdate={(updated) => updateLeg(leg.id, updated)}
              onRemove={() => removeLeg(leg.id)}
              minDate={getMinDate(index)}
              variant="mobile"
            />
          ))}
        </Box>

        {/* Add flight button */}
        {legs.length < 5 && (
          <Box
            component="button"
            onClick={addLeg}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              mb: '32px',
              py: '4px',
              alignSelf: 'flex-start',
              color: '#135bec',
              fontWeight: 700,
              fontSize: '0.875rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              transition: 'transform 150ms',
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            <Icon name="add_circle" className="add-flight-icon-mobile" />
            <style>
              {`
                .add-flight-icon-mobile {
                  font-size: 20px !important;
                  font-weight: 700;
                }
              `}
            </style>
            Add flight
          </Box>
        )}

        {/* Travelers & Class */}
        <Box sx={{ mb: '24px' }}>
          <TravelersSelect
            passengers={passengers}
            cabinClass={cabinClass}
            onPassengersChange={onPassengersChange}
            onCabinClassChange={onCabinClassChange}
            variant="mobile"
          />
        </Box>

        {/* Search button */}
        <Box
          component="button"
          onClick={onSearch}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '56px',
            backgroundColor: '#135bec',
            color: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.3)',
            transition: 'all 150ms',
            border: 'none',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#0e4bce',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: '1.125rem',
              fontWeight: 700,
            }}
          >
            Search Flights
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Flight legs */}
      {legs.map((leg, index) => (
        <FlightLegInput
          key={leg.id}
          leg={leg}
          legNumber={index + 1}
          canRemove={legs.length > 2}
          onUpdate={(updated) => updateLeg(leg.id, updated)}
          onRemove={() => removeLeg(leg.id)}
          minDate={getMinDate(index)}
          variant="desktop"
        />
      ))}

      {/* Add flight button */}
      {legs.length < 5 && (
        <Box sx={{ display: 'flex' }}>
          <Box
            component="button"
            onClick={addLeg}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              px: '20px',
              py: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(19, 91, 236, 0.3)',
              color: '#135bec',
              backgroundColor: 'transparent',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 150ms',
              '&:hover': {
                backgroundColor: 'rgba(19, 91, 236, 0.05)',
                borderColor: '#135bec',
              },
              '& .add-icon': {
                transition: 'transform 150ms',
              },
              '&:hover .add-icon': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <Icon name="add" size="md" className="add-icon" />
            Add another flight
          </Box>
        </Box>
      )}

      {/* Search button */}
      <Box sx={{ pt: '8px' }}>
        <Box
          component="button"
          onClick={onSearch}
          sx={{
            width: '100%',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '12px',
            backgroundColor: '#135bec',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1.125rem',
            boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.3)',
            transition: 'all 150ms',
            border: 'none',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#0e4bce',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          <Icon name="search" size="md" />
          <Box component="span">Search Flights</Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MultiCityForm;
