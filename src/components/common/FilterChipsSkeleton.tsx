import { Skeleton, Box } from '@mui/material';

function FilterChipsSkeleton() {
  const chipWidths = [80, 100, 90, 110, 85];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '12px 16px',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
      }}
    >
      {chipWidths.map((width, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={width}
          height={36}
          animation="wave"
          sx={{
            borderRadius: '9999px',
            flexShrink: 0,
          }}
        />
      ))}
    </Box>
  );
}

export default FilterChipsSkeleton;
