import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

interface LoadingStateProps {
  message?: string;
  variant?: 'page' | 'inline';
}

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

function LoadingState({
  message = 'Searching for the best flights...',
  variant = 'page',
}: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          padding: '24px',
        }}
      >
        <CircularProgress size={24} thickness={4} />
        <Typography
          variant="body2"
          sx={{
            color: '#616f89',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </Box>
    );
  }

  // Page variant
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '48px 24px',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          marginBottom: '32px',
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      >
        <CircularProgress
          size={60}
          thickness={3}
          sx={{
            color: '#135bec',
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: '#111318',
          fontWeight: 600,
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#616f89',
          textAlign: 'center',
          maxWidth: '400px',
        }}
      >
        This may take a few moments
      </Typography>
    </Box>
  );
}

export default LoadingState;
