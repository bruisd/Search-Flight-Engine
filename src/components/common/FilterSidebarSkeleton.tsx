import { Skeleton, Box } from '@mui/material';

function FilterSidebarSkeleton() {
  return (
    <Box
      sx={{
        width: '288px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #f0f2f4',
        padding: '24px',
      }}
    >
      {/* Header: "Filters" + "Reset all" */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Skeleton
          variant="text"
          width={60}
          height={24}
          animation="wave"
        />
        <Skeleton
          variant="text"
          width={60}
          height={16}
          animation="wave"
        />
      </Box>

      {/* Filter sections */}
      {[1, 2, 3, 4].map((section) => (
        <Box key={section} sx={{ marginBottom: '24px' }}>
          {/* Section title */}
          <Skeleton
            variant="text"
            width={100}
            height={20}
            animation="wave"
            sx={{ marginBottom: '12px' }}
          />

          {/* Checkbox rows */}
          {[1, 2, 3, 4].map((item) => (
            <Box
              key={item}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Skeleton
                  variant="rectangular"
                  width={18}
                  height={18}
                  animation="wave"
                  sx={{ borderRadius: '4px' }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={16}
                  animation="wave"
                />
              </Box>
              <Skeleton
                variant="text"
                width={40}
                height={14}
                animation="wave"
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default FilterSidebarSkeleton;
