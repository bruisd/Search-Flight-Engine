import { Box, Slider, Typography } from '@mui/material';
import { formatPrice } from '../../utils/formatters';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  variant?: 'desktop' | 'mobile';
}

/**
 * Calculate reasonable step size based on price range
 * Examples:
 *   $100-$500 → $10 steps
 *   $500-$2000 → $25 steps
 *   $2000-$5000 → $50 steps
 */
function calculateStep(min: number, max: number): number {
  const range = max - min;

  if (range <= 500) return 10;
  if (range <= 2000) return 25;
  if (range <= 5000) return 50;
  return 100;
}

function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  variant = 'desktop',
}: PriceRangeSliderProps) {
  const step = calculateStep(min, max);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      onChange([newValue[0], newValue[1]]);
    }
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
          Price Range
        </Typography>

        <Box sx={{ paddingX: '4px', marginBottom: '16px' }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disableSwap
            sx={{
              color: '#135bec',
              height: 4,
              padding: '13px 0',
              '& .MuiSlider-track': {
                border: 'none',
                height: 4,
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#e5e7eb',
                opacity: 1,
                height: 4,
              },
              '& .MuiSlider-thumb': {
                height: 20,
                width: 20,
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#135bec',
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 3px 6px rgba(19, 91, 236, 0.2)',
                },
                '&.Mui-active': {
                  boxShadow: '0 3px 6px rgba(19, 91, 236, 0.3)',
                },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatPrice(value[0])}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatPrice(value[1])}
          </Typography>
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
          marginBottom: '24px',
        }}
      >
        Price Range
      </Typography>

      <Box sx={{ position: 'relative', height: '48px', width: '100%', paddingTop: '16px' }}>
        {/* Price labels at top */}
        <Box
          sx={{
            position: 'absolute',
            top: '-4px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
            {formatPrice(value[0])}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
            {formatPrice(value[1])}
          </Typography>
        </Box>

        {/* Slider */}
        <Box sx={{ paddingX: '14px', paddingTop: '8px' }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disableSwap
            sx={{
              color: '#135bec',
              height: 6,
              padding: '13px 0',
              '& .MuiSlider-track': {
                border: 'none',
                height: 6,
                borderRadius: '9999px',
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#e5e7eb',
                opacity: 1,
                height: 6,
                borderRadius: '9999px',
              },
              '& .MuiSlider-thumb': {
                height: 28,
                width: 28,
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#135bec',
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.2), 0 4px 6px -2px rgba(19, 91, 236, 0.1)',
                },
                '&.Mui-active': {
                  boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.3), 0 4px 6px -2px rgba(19, 91, 236, 0.15)',
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PriceRangeSlider;
