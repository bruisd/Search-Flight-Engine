import { Box, Typography, Button } from '@mui/material';
import Icon from './Icon';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load the flights. Please try again.",
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      {/* Error Icon */}
      <Box
        sx={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <Icon
          name="error"
          size="xl"
          filled
          className="error-icon"
        />
        <style>
          {`
            .error-icon {
              color: #ef4444;
              font-size: 40px !important;
            }
          `}
        </style>
      </Box>

      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          color: '#111318',
          fontWeight: 700,
          marginBottom: '12px',
          maxWidth: '500px',
        }}
      >
        {title}
      </Typography>

      {/* Message */}
      <Typography
        variant="body1"
        sx={{
          color: '#616f89',
          marginBottom: '32px',
          maxWidth: '450px',
          lineHeight: 1.6,
        }}
      >
        {message}
      </Typography>

      {/* Retry Button */}
      {showRetry && onRetry && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onRetry}
          startIcon={<Icon name="refresh" size="md" />}
          sx={{
            paddingX: '32px',
            paddingY: '12px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: '12px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(19, 91, 236, 0.2)',
            },
          }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
}

export default ErrorState;
