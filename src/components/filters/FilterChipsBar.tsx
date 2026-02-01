import { Box } from '@mui/material';
import FilterChip from './FilterChip';

interface FilterChipsBarProps {
  activeFilters: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  onRemoveFilter: (filterId: string) => void;
  onOpenFilter: (filterType: string) => void;
}

const FILTER_TYPES = [
  { id: 'stops', label: 'Stops' },
  { id: 'airlines', label: 'Airlines' },
  { id: 'bags', label: 'Bags' },
  { id: 'time', label: 'Time' },
];

function FilterChipsBar({
  activeFilters,
  onRemoveFilter,
  onOpenFilter,
}: FilterChipsBarProps) {
  const isFilterActive = (filterId: string) => {
    return activeFilters.some((filter) => filter.id === filterId);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '8px',
        padding: '12px 16px',
        overflowX: 'auto',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      className="no-scrollbar"
    >
      {/* Active Filters First */}
      {activeFilters.map((filter) => (
        <FilterChip
          key={filter.id}
          label={filter.label}
          isActive={true}
          activeValue={filter.value}
          onRemove={() => onRemoveFilter(filter.id)}
        />
      ))}

      {/* Inactive Filter Type Chips */}
      {FILTER_TYPES.map((filterType) => {
        const active = isFilterActive(filterType.id);

        // Don't show inactive chip if it's already active
        if (active) return null;

        return (
          <FilterChip
            key={filterType.id}
            label={filterType.label}
            isActive={false}
            hasDropdown={true}
            onClick={() => onOpenFilter(filterType.id)}
          />
        );
      })}
    </Box>
  );
}

export default FilterChipsBar;
