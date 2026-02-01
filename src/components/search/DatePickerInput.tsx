import { useRef } from 'react';
import { Box } from '@mui/material';
import Icon from '../common/Icon';
import { formatDate, formatDateWithDay } from '../../utils/formatters';
import { format } from 'date-fns';

interface DatePickerInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  icon?: string;
  variant?: 'desktop' | 'mobile';
  isPrimary?: boolean; // For icon color
}

function DatePickerInput({
  label,
  value,
  onChange,
  placeholder = 'Add date',
  minDate,
  icon = 'calendar_today',
  variant = 'desktop',
  isPrimary = false,
}: DatePickerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.showPicker();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      onChange(new Date(dateValue));
    } else {
      onChange(null);
    }
  };

  const displayValue = value
    ? variant === 'mobile'
      ? formatDateWithDay(value.toISOString())
      : formatDate(value.toISOString())
    : '';

  const minDateString = minDate ? format(minDate, 'yyyy-MM-dd') : undefined;
  const valueDateString = value ? format(value, 'yyyy-MM-dd') : '';

  if (variant === 'mobile') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Label */}
        <Box
          component="label"
          sx={{
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
        <Box
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '48px',
            paddingX: '12px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#f3f4f6',
            },
          }}
        >
          <Icon
            name={icon}
            size="md"
            className="date-icon-mobile"
          />
          <style>
            {`
              .date-icon-mobile {
                color: #94a3b8;
                margin-right: 8px;
              }
            `}
          </style>

          {/* Display value */}
          <Box
            component="span"
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: value ? '#111318' : '#94a3b8',
            }}
          >
            {displayValue || placeholder}
          </Box>

          {/* Hidden native input */}
          <input
            ref={inputRef}
            type="date"
            value={valueDateString}
            min={minDateString}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </Box>
      </Box>
    );
  }

  // Desktop variant
  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        backgroundColor: '#ffffff',
        height: '60px',
        cursor: 'pointer',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: '#f9fafb',
        },
      }}
    >
      {/* Floating label */}
      <Box
        component="label"
        sx={{
          position: 'absolute',
          left: '16px',
          top: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#616f89',
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
          pointerEvents: 'none',
        }}
      >
        <Icon
          name={icon}
          size="md"
          className={`date-icon-desktop ${isPrimary ? 'primary' : ''}`}
        />
        <style>
          {`
            .date-icon-desktop {
              color: #9ca3af;
            }
            .date-icon-desktop.primary {
              color: #135bec;
            }
          `}
        </style>
      </Box>

      {/* Display value */}
      <Box
        component="div"
        sx={{
          width: '100%',
          height: '100%',
          paddingLeft: '48px',
          paddingRight: '8px',
          paddingTop: '20px',
          paddingBottom: '4px',
          display: 'flex',
          alignItems: 'flex-end',
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: value ? '#111318' : '#9ca3af',
        }}
      >
        {displayValue || placeholder}
      </Box>

      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="date"
        value={valueDateString}
        min={minDateString}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}

export default DatePickerInput;
