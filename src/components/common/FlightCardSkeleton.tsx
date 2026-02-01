import { Skeleton, Box, useMediaQuery, useTheme } from '@mui/material';

interface FlightCardSkeletonProps {
  variant?: 'desktop' | 'mobile';
}

function FlightCardSkeleton({ variant }: FlightCardSkeletonProps) {
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
          marginBottom: '12px',
        }}
      >
        {/* Top row: Logo + Airline name | Price */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              animation="wave"
            />
            <Box>
              <Skeleton
                variant="text"
                width={100}
                height={16}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width={60}
                height={14}
                animation="wave"
              />
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Skeleton
              variant="text"
              width={60}
              height={24}
              animation="wave"
            />
          </Box>
        </Box>

        {/* Middle: Time - line - Time */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <Box>
            <Skeleton
              variant="text"
              width={50}
              height={20}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={40}
              height={14}
              animation="wave"
            />
          </Box>
          <Box sx={{ flex: 1, mx: 2 }}>
            <Skeleton
              variant="rectangular"
              height={2}
              animation="wave"
              sx={{ borderRadius: '1px' }}
            />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Skeleton
              variant="text"
              width={50}
              height={20}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={40}
              height={14}
              animation="wave"
            />
          </Box>
        </Box>

        {/* Bottom: Full-width button */}
        <Skeleton
          variant="rectangular"
          height={44}
          animation="wave"
          sx={{ borderRadius: '8px' }}
        />
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
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left: Airline logo + name */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '80px' }}>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          animation="wave"
        />
        <Skeleton
          variant="text"
          width={60}
          height={14}
          animation="wave"
        />
      </Box>

      {/* Center: Flight details grid */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '32px', px: 4 }}>
        {/* Departure */}
        <Box>
          <Skeleton
            variant="text"
            width={60}
            height={28}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width={40}
            height={16}
            animation="wave"
          />
        </Box>

        {/* Duration line */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Skeleton
            variant="text"
            width={60}
            height={14}
            animation="wave"
            sx={{ margin: '0 auto', mb: 1 }}
          />
          <Skeleton
            variant="rectangular"
            height={2}
            animation="wave"
            sx={{ borderRadius: '1px', mb: 1 }}
          />
          <Skeleton
            variant="text"
            width={50}
            height={14}
            animation="wave"
            sx={{ margin: '0 auto' }}
          />
        </Box>

        {/* Arrival */}
        <Box sx={{ textAlign: 'right' }}>
          <Skeleton
            variant="text"
            width={60}
            height={28}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width={40}
            height={16}
            animation="wave"
          />
        </Box>
      </Box>

      {/* Right: Price + button */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '140px' }}>
        <Skeleton
          variant="text"
          width={80}
          height={32}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          width={120}
          height={40}
          animation="wave"
          sx={{ borderRadius: '8px' }}
        />
      </Box>
    </Box>
  );
}

export default FlightCardSkeleton;
