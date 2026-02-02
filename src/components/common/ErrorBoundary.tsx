import { Component } from 'react';
import type { ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Icon from './Icon';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f6f6f8',
            padding: '24px',
          }}
        >
          <Box
            sx={{
              maxWidth: '500px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              padding: '48px 32px',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Icon
              name="error"
              className="error-icon"
            />
            <style>
              {`
                .error-icon {
                  font-size: 64px !important;
                  color: #ef4444;
                  margin-bottom: 24px;
                }
              `}
            </style>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                marginBottom: '12px',
                color: '#111318',
              }}
            >
              Something went wrong
            </Typography>
            <Typography
              sx={{
                color: '#64748b',
                marginBottom: '24px',
                fontSize: '0.9375rem',
              }}
            >
              We encountered an unexpected error. Please try again or return to the homepage.
            </Typography>
            {import.meta.env.DEV && this.state.error && (
              <Box
                sx={{
                  backgroundColor: '#fee',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  textAlign: 'left',
                  color: '#c00',
                  overflowX: 'auto',
                }}
              >
                {this.state.error.toString()}
              </Box>
            )}
            <Button
              variant="contained"
              onClick={this.handleReset}
              sx={{
                backgroundColor: '#135bec',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'none',
                paddingX: '32px',
                paddingY: '12px',
                '&:hover': {
                  backgroundColor: '#0e4bce',
                },
              }}
            >
              Return to Homepage
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
