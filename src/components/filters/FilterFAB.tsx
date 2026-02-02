import { Badge, Box, Button } from '@mui/material';
import Icon from '../common/Icon';

interface FilterFABProps {
  onClick: () => void;
  activeFilterCount?: number;
}

function FilterFAB({ onClick, activeFilterCount = 0 }: FilterFABProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        display: { xs: 'block', lg: 'none' },
      }}
    >
      <Badge
        badgeContent={activeFilterCount}
        color="error"
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#ef4444',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.75rem',
            minWidth: '20px',
            height: '20px',
            borderRadius: '10px',
          },
        }}
        invisible={activeFilterCount === 0}
      >
        <Button
          onClick={onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#135bec',
            color: '#ffffff',
            paddingX: '20px',
            paddingY: '12px',
            borderRadius: '9999px',
            boxShadow: '0 10px 15px -3px rgba(19, 91, 236, 0.3), 0 4px 6px -2px rgba(19, 91, 236, 0.2)',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            transition: 'all 0.2s',
          }}
        >
          <Icon name="filter_list" className="filter-fab-icon" />
          <style>
            {`
              .filter-fab-icon {
                font-size: 20px !important;
              }
            `}
          </style>
          <span>Filter</span>
        </Button>
      </Badge>
    </Box>
  );
}

export default FilterFAB;
