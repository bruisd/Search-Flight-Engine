import { ToggleButtonGroup, ToggleButton } from '@mui/material';

interface TripTypeToggleProps {
  value: 'round-trip' | 'one-way' | 'multi-city';
  onChange: (value: 'round-trip' | 'one-way' | 'multi-city') => void;
}

function TripTypeToggle({ value, onChange }: TripTypeToggleProps) {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: 'round-trip' | 'one-way' | 'multi-city' | null
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="trip type"
      sx={{
        display: 'flex',
        height: '48px',
        width: 'fit-content',
        alignItems: 'center',
        borderRadius: '12px',
        backgroundColor: '#f0f2f4',
        padding: '6px',
        border: 'none',
        gap: '4px',
      }}
    >
      <ToggleButton
        value="round-trip"
        aria-label="round-trip"
        sx={{
          border: 'none',
          height: '100%',
          borderRadius: '8px',
          paddingX: '16px',
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#616f89',
          backgroundColor: 'transparent',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: '#111318',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: '#ffffff',
            },
          },
        }}
      >
        Round-trip
      </ToggleButton>

      <ToggleButton
        value="one-way"
        aria-label="one-way"
        sx={{
          border: 'none',
          height: '100%',
          borderRadius: '8px',
          paddingX: '16px',
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#616f89',
          backgroundColor: 'transparent',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: '#111318',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: '#ffffff',
            },
          },
        }}
      >
        One-way
      </ToggleButton>

      <ToggleButton
        value="multi-city"
        aria-label="multi-city"
        sx={{
          border: 'none',
          height: '100%',
          borderRadius: '8px',
          paddingX: '16px',
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#616f89',
          backgroundColor: 'transparent',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: '#111318',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: '#ffffff',
            },
          },
        }}
      >
        Multi-city
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default TripTypeToggle;
