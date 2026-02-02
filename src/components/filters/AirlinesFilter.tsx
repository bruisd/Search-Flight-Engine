import { Box, Checkbox, Switch, Typography } from '@mui/material';
import type { AirlineInfo } from '../../types';

interface AirlinesFilterProps {
  airlines: AirlineInfo[];
  selectedAirlines: string[];
  onChange: (airlines: string[]) => void;
  variant?: 'desktop' | 'mobile';
}

/**
 * Generate a consistent color for an airline code
 * Same code always returns the same color
 */
function getAirlineColor(code: string): string {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#6366f1', // indigo
    '#14b8a6', // teal
  ];

  // Simple hash function for consistent color selection
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Get airline logo URL
 * Returns path to logo or null if not available
 */
function getAirlineLogoUrl(code: string): string {
  // Map of known airline codes to logo paths
  const logoMap: Record<string, string> = {
    DL: '/airlines/delta.svg',
    AA: '/airlines/american.svg',
    UA: '/airlines/united.svg',
    BA: '/airlines/british-airways.svg',
    LH: '/airlines/lufthansa.svg',
    AF: '/airlines/air-france.svg',
    KL: '/airlines/klm.svg',
    EK: '/airlines/emirates.svg',
    QR: '/airlines/qatar.svg',
    SQ: '/airlines/singapore.svg',
  };

  return logoMap[code] || '';
}

/**
 * Airline logo component with fallback to colored circle
 */
interface AirlineLogoProps {
  code: string;
  name: string;
  size: number;
}

function AirlineLogo({ code, name, size }: AirlineLogoProps) {
  const logoUrl = getAirlineLogoUrl(code);
  const color = getAirlineColor(code);

  // Try to show logo image, fallback to colored circle
  if (logoUrl) {
    return (
      <Box
        sx={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: '#f9fafb',
          padding: '2px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={logoUrl}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onError={(e) => {
            // On error, hide image and show fallback
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </Box>
    );
  }

  // Fallback: colored circle with airline code
  return (
    <Box
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: size < 30 ? '0.625rem' : '0.75rem',
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {code.substring(0, 2).toUpperCase()}
    </Box>
  );
}

function AirlinesFilter({
  airlines,
  selectedAirlines,
  onChange,
  variant = 'desktop',
}: AirlinesFilterProps) {
  const handleToggle = (code: string) => {
    const isSelected = selectedAirlines.includes(code);
    const newAirlines = isSelected
      ? selectedAirlines.filter((a) => a !== code)
      : [...selectedAirlines, code];
    onChange(newAirlines);
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
          Airlines
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {airlines.map((airline) => {
            const isChecked = selectedAirlines.includes(airline.code);

            return (
              <Box
                key={airline.code}
                component="label"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={() => handleToggle(airline.code)}
                  sx={{
                    padding: 0,
                    width: '16px',
                    height: '16px',
                    color: '#d1d5db',
                    '&.Mui-checked': {
                      color: '#135bec',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '16px',
                    },
                  }}
                />

                <AirlineLogo code={airline.code} name={airline.name} size={24} />

                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: '#374151',
                  }}
                >
                  {airline.name}
                </Typography>
              </Box>
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
        Airlines
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {airlines.map((airline) => {
          const isChecked = selectedAirlines.includes(airline.code);

          return (
            <Box
              key={airline.code}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Box
                  sx={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    padding: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AirlineLogo code={airline.code} name={airline.name} size={32} />
                </Box>

                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  {airline.name}
                </Typography>
              </Box>

              <Box component="label" sx={{ position: 'relative', display: 'inline-flex', cursor: 'pointer' }}>
                <Switch
                  checked={isChecked}
                  onChange={() => handleToggle(airline.code)}
                  sx={{
                    width: 44,
                    height: 24,
                    padding: 0,
                    '& .MuiSwitch-switchBase': {
                      padding: 0,
                      margin: '2px',
                      transitionDuration: '300ms',
                      '&.Mui-checked': {
                        transform: 'translateX(20px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#135bec',
                          opacity: 1,
                          border: 0,
                        },
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      boxSizing: 'border-box',
                      width: 20,
                      height: 20,
                      border: '1px solid #d1d5db',
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 12,
                      backgroundColor: '#e5e7eb',
                      opacity: 1,
                      transition: 'background-color 300ms',
                    },
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default AirlinesFilter;
