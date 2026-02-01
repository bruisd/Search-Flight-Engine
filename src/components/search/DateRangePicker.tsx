import { Box, useMediaQuery, useTheme } from '@mui/material';
import DatePickerInput from './DatePickerInput';

interface DateRangePickerProps {
  departureDate: Date | null;
  returnDate: Date | null;
  onDepartureChange: (date: Date | null) => void;
  onReturnChange: (date: Date | null) => void;
  isOneWay?: boolean;
}

function DateRangePicker({
  departureDate,
  returnDate,
  onDepartureChange,
  onReturnChange,
  isOneWay = false,
}: DateRangePickerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDepartureChange = (date: Date | null) => {
    onDepartureChange(date);

    // If departure is after return, clear return date
    if (date && returnDate && date > returnDate) {
      onReturnChange(null);
    }
  };

  const handleReturnChange = (date: Date | null) => {
    onReturnChange(date);
  };

  // Mobile layout
  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isOneWay ? '1fr' : '1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <DatePickerInput
          label="Departure"
          value={departureDate}
          onChange={handleDepartureChange}
          icon="calendar_today"
          variant="mobile"
          minDate={new Date()}
        />

        {!isOneWay && (
          <DatePickerInput
            label="Return"
            value={returnDate}
            onChange={handleReturnChange}
            icon="event"
            variant="mobile"
            minDate={departureDate || new Date()}
            placeholder="Add date"
          />
        )}
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: isOneWay ? '1fr' : '1fr 1fr',
        gap: '1px',
        backgroundColor: '#e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        position: 'relative',
      }}
    >
      <DatePickerInput
        label="Departure"
        value={departureDate}
        onChange={handleDepartureChange}
        icon="calendar_today"
        variant="desktop"
        isPrimary={true}
        minDate={new Date()}
      />

      {!isOneWay && (
        <DatePickerInput
          label="Return"
          value={returnDate}
          onChange={handleReturnChange}
          icon="calendar_today"
          variant="desktop"
          isPrimary={false}
          minDate={departureDate || new Date()}
          placeholder="Add date"
        />
      )}
    </Box>
  );
}

export default DateRangePicker;
