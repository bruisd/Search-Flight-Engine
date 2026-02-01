import { Skeleton, Box, useMediaQuery, useTheme } from '@mui/material';

interface PriceChartSkeletonProps {
  variant?: 'desktop' | 'mobile';
}

function PriceChartSkeleton({ variant }: PriceChartSkeletonProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const displayVariant = variant || (isMobile ? 'mobile' : 'desktop');

  if (displayVariant === 'mobile') {
    return (
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #f0f2f4',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        {/* Header row with icon + text */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Skeleton
              variant="circular"
              width={20}
              height={20}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={100}
              height={20}
              animation="wave"
            />
          </Box>
          <Skeleton
            variant="circular"
            width={20}
            height={20}
            animation="wave"
          />
        </Box>

        {/* Content: Price skeletons */}
        <Box sx={{ marginBottom: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px', mb: 1 }}>
            <Skeleton
              variant="text"
              width={80}
              height={32}
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              width={60}
              height={20}
              animation="wave"
              sx={{ borderRadius: '12px' }}
            />
          </Box>
          <Skeleton
            variant="text"
            width={120}
            height={16}
            animation="wave"
          />
        </Box>

        {/* Chart rectangle */}
        <Skeleton
          variant="rectangular"
          height={140}
          animation="wave"
          sx={{ borderRadius: '8px', marginBottom: '16px' }}
        />

        {/* Date labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {[1, 2, 3, 4].map((index) => (
            <Skeleton
              key={index}
              variant="text"
              width={40}
              height={14}
              animation="wave"
            />
          ))}
        </Box>
      </Box>
    );
  }

  // Desktop version
  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #f0f2f4',
        padding: '24px',
        marginBottom: '24px',
      }}
    >
      {/* Top row: Title + Link */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Box>
          <Skeleton
            variant="text"
            width={120}
            height={24}
            animation="wave"
            sx={{ marginBottom: '8px' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <Skeleton
              variant="text"
              width={100}
              height={40}
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              width={70}
              height={24}
              animation="wave"
              sx={{ borderRadius: '12px' }}
            />
          </Box>
        </Box>
        <Skeleton
          variant="text"
          width={140}
          height={20}
          animation="wave"
        />
      </Box>

      {/* Chart area */}
      <Skeleton
        variant="rectangular"
        height={140}
        animation="wave"
        sx={{ borderRadius: '8px', marginBottom: '16px' }}
      />

      {/* Date labels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        {[1, 2, 3, 4].map((index) => (
          <Skeleton
            key={index}
            variant="text"
            width={50}
            height={14}
            animation="wave"
          />
        ))}
      </Box>
    </Box>
  );
}

export default PriceChartSkeleton;
