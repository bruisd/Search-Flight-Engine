import { Box, Checkbox, Typography } from '@mui/material';
import { formatPrice } from '../../utils/formatters';
import Icon from '../common/Icon';

interface StopsFilterProps {
  selectedStops: number[];
  onChange: (stops: number[]) => void;
  stopPrices?: {
    direct?: number;
    oneStop?: number;
    twoPlus?: number;
  };
  variant?: 'desktop' | 'mobile';
}

interface StopOption {
  value: number;
  label: string;
  mobileLabel: string;
  priceKey: 'direct' | 'oneStop' | 'twoPlus';
}

const STOP_OPTIONS: StopOption[] = [
  { value: 0, label: 'Direct', mobileLabel: 'Non-stop', priceKey: 'direct' },
  { value: 1, label: '1 Stop', mobileLabel: '1 Stop', priceKey: 'oneStop' },
  { value: 2, label: '2+ Stops', mobileLabel: '2+ Stops', priceKey: 'twoPlus' },
];

function StopsFilter({
  selectedStops,
  onChange,
  stopPrices,
  variant = 'desktop',
}: StopsFilterProps) {
  const handleToggle = (value: number) => {
    const isSelected = selectedStops.includes(value);
    const newStops = isSelected
      ? selectedStops.filter((s) => s !== value)
      : [...selectedStops, value];
    onChange(newStops);
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
          Stops
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STOP_OPTIONS.map((option) => {
            const isChecked = selectedStops.includes(option.value);
            const price = stopPrices?.[option.priceKey];

            return (
              <Box
                key={option.value}
                component="label"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  '&:hover .stop-label': {
                    color: '#135bec',
                  },
                }}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={() => handleToggle(option.value)}
                  sx={{
                    padding: 0,
                    width: '20px',
                    height: '20px',
                    color: '#d1d5db',
                    '&.Mui-checked': {
                      color: '#135bec',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px',
                    },
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                  }}
                >
                  <Typography
                    className="stop-label"
                    sx={{
                      color: '#374151',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                    }}
                  >
                    {option.label}
                  </Typography>

                  {price !== undefined && (
                    <Typography
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                      }}
                    >
                      {formatPrice(price)}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }

  // Mobile variant
  return (
    <Box sx={{ paddingX: '24px', paddingTop: '24px', paddingBottom: '8px' }}>
      <Typography
        component="h3"
        sx={{
          fontSize: '1.125rem',
          fontWeight: 700,
          marginBottom: '12px',
        }}
      >
        Stops
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {STOP_OPTIONS.map((option) => {
          const isChecked = selectedStops.includes(option.value);
          const price = stopPrices?.[option.priceKey];

          return (
            <Box
              key={option.value}
              component="label"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Custom checkbox with checkmark overlay */}
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    component="input"
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(option.value)}
                    sx={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      appearance: 'none',
                      borderRadius: '4px',
                      border: '2px solid',
                      borderColor: isChecked ? '#135bec' : '#d1d5db',
                      backgroundColor: isChecked ? '#135bec' : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#135bec',
                      },
                    }}
                  />
                  {isChecked && (
                    <Icon
                      name="check"
                      className="checkbox-check"
                      size="sm"
                    />
                  )}
                  <style>
                    {`
                      .checkbox-check {
                        pointer-events: none;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 16px !important;
                        color: white;
                      }
                    `}
                  </style>
                </Box>

                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#374151',
                  }}
                >
                  {option.mobileLabel}
                </Typography>
              </Box>

              {price !== undefined && (
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#6b7280',
                  }}
                >
                  from {formatPrice(price)}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default StopsFilter;
