import { Box, Typography, Button } from '@mui/material';
import Icon from './Icon';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
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
      {/* Icon */}
      {icon && (
        <Box
          sx={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            backgroundColor: '#f6f6f8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <Icon
            name={icon}
            size="xl"
            className="empty-state-icon"
          />
          <style>
            {`
              .empty-state-icon {
                color: #9ca3af;
                font-size: 48px !important;
              }
            `}
          </style>
        </Box>
      )}

      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          color: '#111318',
          fontWeight: 700,
          marginBottom: subtitle ? '12px' : '0',
          maxWidth: '500px',
        }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: '#616f89',
            marginBottom: action ? '32px' : '0',
            maxWidth: '450px',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      )}

      {/* Action Button */}
      {action && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={action.onClick}
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
          {action.label}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
