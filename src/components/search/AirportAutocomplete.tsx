import { useState, useMemo } from 'react';
import { Autocomplete, TextField, Box, useMediaQuery, useTheme } from '@mui/material';
import Icon from '../common/Icon';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

interface AirportAutocompleteProps {
  label: string;
  icon: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder?: string;
  variant?: 'desktop' | 'mobile';
  borderRadius?: 'top' | 'bottom' | 'default';
}

// Hardcoded airport list (30+ major airports)
const AIRPORTS: Airport[] = [
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
  { code: 'FCO', name: 'Leonardo da Vinci International', city: 'Rome', country: 'Italy' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA' },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA' },
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada' },
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico' },
  { code: 'GRU', name: 'São Paulo/Guarulhos International', city: 'São Paulo', country: 'Brazil' },
  { code: 'EZE', name: 'Ministro Pistarini International', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', country: 'South Africa' },
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt' },
  { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India' },
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China' },
  { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China' },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'USA' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA' },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'USA' },
];

function AirportAutocomplete({
  label,
  icon,
  value,
  onChange,
  placeholder = 'City or Airport',
  variant,
  borderRadius = 'default',
}: AirportAutocompleteProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const displayVariant = variant || (isMobile ? 'mobile' : 'desktop');
  const [isFocused, setIsFocused] = useState(false);

  const displayValue = useMemo(() => {
    if (value) {
      return `${value.city} (${value.code})`;
    }
    return '';
  }, [value]);

  const getBorderRadius = () => {
    if (displayVariant === 'mobile') {
      if (borderRadius === 'top') return '12px 12px 0 0';
      if (borderRadius === 'bottom') return '0 0 12px 12px';
    }
    return '12px';
  };

  if (displayVariant === 'mobile') {
    return (
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        {/* Label above */}
        <Box
          component="label"
          sx={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#64748b',
            marginBottom: '4px',
            marginLeft: '4px',
          }}
        >
          {label}
        </Box>

        {/* Input container */}
        <Autocomplete
          value={value}
          onChange={(_event, newValue) => onChange(newValue)}
          options={AIRPORTS}
          getOptionLabel={(option) => `${option.city} (${option.code})`}
          filterOptions={(options, state) => {
            const inputValue = state.inputValue.toLowerCase();
            if (inputValue.length < 2) return [];
            return options.filter(
              (option) =>
                option.city.toLowerCase().includes(inputValue) ||
                option.code.toLowerCase().includes(inputValue) ||
                option.name.toLowerCase().includes(inputValue) ||
                option.country.toLowerCase().includes(inputValue)
            );
          }}
          renderInput={(params) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: '56px',
                paddingX: '16px',
                backgroundColor: '#f9fafb',
                border: `1px solid ${isFocused ? '#135bec' : '#e5e7eb'}`,
                borderRadius: getBorderRadius(),
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                ...(isFocused && {
                  ring: '2px',
                  ringColor: 'rgba(19, 91, 236, 0.2)',
                  borderColor: '#135bec',
                }),
              }}
            >
              <Icon
                name={icon}
                size="md"
                className={`airport-icon-mobile ${isFocused ? 'focused' : ''}`}
              />
              <style>
                {`
                  .airport-icon-mobile {
                    color: #94a3b8;
                    margin-right: 12px;
                    transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1);
                  }
                  .airport-icon-mobile.focused {
                    color: #135bec;
                  }
                `}
              </style>
              <TextField
                {...params}
                placeholder={placeholder}
                variant="standard"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  sx: {
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    '& input::placeholder': {
                      color: '#94a3b8',
                      opacity: 1,
                    },
                  },
                }}
                sx={{
                  flex: 1,
                  '& .MuiInput-root:before, & .MuiInput-root:after': {
                    display: 'none',
                  },
                }}
              />
            </Box>
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{
                padding: '12px 16px',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#f6f6f8',
                },
              }}
            >
              <Box sx={{ fontWeight: 600, color: '#111318' }}>
                {option.name} ({option.code})
              </Box>
              <Box sx={{ fontSize: '0.75rem', color: '#616f89', marginTop: '2px' }}>
                {option.city}, {option.country}
              </Box>
            </Box>
          )}
        />
      </Box>
    );
  }

  // Desktop variant
  return (
    <Box sx={{ position: 'relative' }}>
      <Autocomplete
        value={value}
        onChange={(_event, newValue) => onChange(newValue)}
        options={AIRPORTS}
        getOptionLabel={(option) => `${option.city} (${option.code})`}
        inputValue={displayValue}
        filterOptions={(options, state) => {
          const inputValue = state.inputValue.toLowerCase();
          if (inputValue.length < 2) return [];
          return options.filter(
            (option) =>
              option.city.toLowerCase().includes(inputValue) ||
              option.code.toLowerCase().includes(inputValue) ||
              option.name.toLowerCase().includes(inputValue) ||
              option.country.toLowerCase().includes(inputValue)
          );
        }}
        renderInput={(params) => (
          <Box sx={{ position: 'relative' }}>
            {/* Floating Label */}
            <Box
              component="label"
              sx={{
                position: 'absolute',
                left: '16px',
                top: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#616f89',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            >
              {label}
            </Box>

            {/* Icon */}
            <Box
              sx={{
                position: 'absolute',
                left: '16px',
                bottom: '14px',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            >
              <Icon
                name={icon}
                size="md"
                className={`airport-icon-desktop ${isFocused ? 'focused' : ''}`}
              />
              <style>
                {`
                  .airport-icon-desktop {
                    color: #9ca3af;
                    transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1);
                  }
                  .airport-icon-desktop.focused {
                    color: #135bec;
                  }
                `}
              </style>
            </Box>

            {/* Input */}
            <TextField
              {...params}
              placeholder={placeholder}
              variant="outlined"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              InputProps={{
                ...params.InputProps,
                sx: {
                  height: '60px',
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  paddingTop: '20px',
                  paddingBottom: '4px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: '#111318',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e5e7eb',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#135bec',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(19, 91, 236, 0.1)',
                  },
                  '& input::placeholder': {
                    color: '#9ca3af',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              padding: '12px 16px',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: '#f6f6f8',
              },
            }}
          >
            <Box sx={{ fontWeight: 600, color: '#111318' }}>
              {option.name} ({option.code})
            </Box>
            <Box sx={{ fontSize: '0.75rem', color: '#616f89', marginTop: '2px' }}>
              {option.city}, {option.country}
            </Box>
          </Box>
        )}
      />
    </Box>
  );
}

export default AirportAutocomplete;
