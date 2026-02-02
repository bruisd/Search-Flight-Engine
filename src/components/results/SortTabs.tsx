import { Box, Button } from '@mui/material';
import { formatPrice, formatDuration } from '../../utils/formatters';

export type SortOption = 'cheapest' | 'fastest' | 'best';

interface SortTabsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  stats?: {
    cheapestPrice?: number;
    fastestDuration?: number;
  };
  variant?: 'desktop' | 'mobile';
}

function SortTabs({ value, onChange, stats, variant = 'desktop' }: SortTabsProps) {
  const tabs: Array<{
    value: SortOption;
    label: string;
    subtitle?: string;
  }> = [
    {
      value: 'cheapest',
      label: 'Cheapest',
      subtitle: stats?.cheapestPrice ? formatPrice(stats.cheapestPrice) : undefined,
    },
    {
      value: 'fastest',
      label: 'Fastest',
      subtitle: stats?.fastestDuration ? formatDuration(stats.fastestDuration) : undefined,
    },
    {
      value: 'best',
      label: 'Best',
      subtitle: 'Mix',
    },
  ];

  // Desktop variant
  if (variant === 'desktop') {
    return (
      <Box
        sx={{
          backgroundColor: '#e5e7eb', // gray-200
          padding: '4px',
          borderRadius: '8px',
          display: 'inline-flex',
        }}
      >
        {tabs.map((tab) => {
          const isActive = value === tab.value;

          return (
            <Button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              sx={{
                paddingX: '16px',
                paddingY: '6px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#135bec' : '#6b7280',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                boxShadow: isActive
                  ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  : 'none',
                textTransform: 'none',
                minWidth: 'auto',
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  color: isActive ? '#135bec' : '#1f2937',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                },
              }}
            >
              {tab.label}
            </Button>
          );
        })}
      </Box>
    );
  }

  // Mobile variant
  return (
    <Box
      sx={{
        backgroundColor: '#e5e7eb', // gray-200
        padding: '4px',
        borderRadius: '12px',
        display: 'flex',
        fontSize: '0.875rem',
        fontWeight: 500,
        position: 'relative',
      }}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.value;

        return (
          <Box
            key={tab.value}
            onClick={() => onChange(tab.value)}
            sx={{
              flex: 1,
              textAlign: 'center',
              paddingY: '8px',
              paddingX: '12px',
              borderRadius: '8px',
              backgroundColor: isActive ? '#ffffff' : 'transparent',
              color: isActive ? '#135bec' : '#6b7280',
              boxShadow: isActive
                ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                : 'none',
              zIndex: isActive ? 10 : 1,
              cursor: 'pointer',
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Label */}
            <Box
              component="span"
              sx={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {tab.label}
            </Box>

            {/* Subtitle */}
            {tab.subtitle && (
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontSize: '10px',
                  opacity: 0.8,
                }}
              >
                {tab.subtitle}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default SortTabs;
