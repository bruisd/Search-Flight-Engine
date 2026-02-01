import { Box } from '@mui/material';
import Icon from '../common/Icon';

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  activeValue?: string;
  hasDropdown?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

function FilterChip({
  label,
  isActive = false,
  activeValue,
  hasDropdown = true,
  onRemove,
  onClick,
}: FilterChipProps) {
  const displayLabel = isActive && activeValue ? activeValue : label;

  if (isActive) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '32px',
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          borderRadius: '9999px',
          backgroundColor: '#135bec',
          color: '#ffffff',
          paddingLeft: '12px',
          paddingRight: '8px',
          boxShadow: '0 1px 2px 0 rgba(19, 91, 236, 0.2)',
          cursor: 'pointer',
        }}
        onClick={onRemove}
      >
        <Box
          component="p"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          {displayLabel}
        </Box>
        <Icon
          name="close"
          className="filter-chip-close-icon"
        />
        <style>
          {`
            .filter-chip-close-icon {
              font-size: 16px !important;
              color: #ffffff;
            }
          `}
        </style>
      </Box>
    );
  }

  // Inactive chip
  return (
    <Box
      sx={{
        display: 'flex',
        height: '32px',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '9999px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        paddingLeft: '16px',
        paddingRight: '16px',
        cursor: 'pointer',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: '#135bec',
          backgroundColor: 'rgba(19, 91, 236, 0.05)',
        },
      }}
      onClick={onClick}
    >
      <Box
        component="p"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#374151',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
      >
        {displayLabel}
      </Box>
      {hasDropdown && (
        <>
          <Icon
            name="keyboard_arrow_down"
            className="filter-chip-dropdown-icon"
          />
          <style>
            {`
              .filter-chip-dropdown-icon {
                font-size: 16px !important;
                color: #9ca3af;
              }
            `}
          </style>
        </>
      )}
    </Box>
  );
}

export default FilterChip;
