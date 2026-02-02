import { Box, Button, Typography } from '@mui/material';
import Icon from '../common/Icon';

interface DepartureTimeFilterProps {
  selectedTimes: string[];
  onChange: (times: string[]) => void;
  variant?: 'desktop' | 'mobile';
}

interface TimeSlot {
  value: string;
  label: string;
  icon: string;
  timeRange: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { value: 'morning', label: 'Morning', icon: 'wb_twilight', timeRange: '06-12' },
  { value: 'afternoon', label: 'Afternoon', icon: 'light_mode', timeRange: '12-18' },
  { value: 'evening', label: 'Evening', icon: 'dark_mode', timeRange: '18-00' },
];

function DepartureTimeFilter({
  selectedTimes,
  onChange,
  variant = 'desktop',
}: DepartureTimeFilterProps) {
  const handleToggle = (value: string) => {
    const isSelected = selectedTimes.includes(value);
    const newTimes = isSelected
      ? selectedTimes.filter((t) => t !== value)
      : [...selectedTimes, value];
    onChange(newTimes);
  };

  // Desktop variant
  if (variant === 'desktop') {
    return (
      <Box
        sx={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #f0f2f4',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <Typography
          component="h4"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            marginBottom: '16px',
          }}
        >
          Departure Time
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}
        >
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTimes.includes(slot.value);

            return (
              <Button
                key={slot.value}
                onClick={() => handleToggle(slot.value)}
                sx={{
                  border: isSelected ? '1px solid #135bec' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#135bec' : '#4b5563',
                  backgroundColor: isSelected ? 'rgba(19, 91, 236, 0.1)' : 'transparent',
                  textTransform: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: isSelected ? 'rgba(19, 91, 236, 0.15)' : '#f9fafb',
                    borderColor: isSelected ? '#135bec' : '#e5e7eb',
                  },
                }}
              >
                {slot.label}
              </Button>
            );
          })}
        </Box>
      </Box>
    );
  }

  // Mobile variant
  return (
    <Box sx={{ paddingX: '24px' }}>
      <Typography
        component="h3"
        sx={{
          fontSize: '1.125rem',
          fontWeight: 700,
          marginBottom: '16px',
        }}
      >
        Departure Time
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >
        {TIME_SLOTS.map((slot) => {
          const isSelected = selectedTimes.includes(slot.value);

          return (
            <Button
              key={slot.value}
              onClick={() => handleToggle(slot.value)}
              sx={{
                display: 'flex',
                minWidth: '100px',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderRadius: '16px',
                border: isSelected ? '2px solid #135bec' : '1px solid #e5e7eb',
                backgroundColor: isSelected ? 'rgba(19, 91, 236, 0.1)' : 'transparent',
                paddingX: '16px',
                paddingY: '12px',
                color: isSelected ? '#135bec' : '#6b7280',
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: isSelected ? 'rgba(19, 91, 236, 0.15)' : '#f9fafb',
                  borderColor: isSelected ? '#135bec' : '#d1d5db',
                },
              }}
            >
              <Icon name={slot.icon} className="time-slot-icon" />
              <style>
                {`
                  .time-slot-icon {
                    font-size: 20px !important;
                  }
                `}
              </style>

              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {slot.label}
              </Typography>

              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  opacity: 0.8,
                }}
              >
                {slot.timeRange}
              </Typography>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

export default DepartureTimeFilter;
