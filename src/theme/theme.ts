import { createTheme } from '@mui/material/styles';

const colors = {
  primary: '#135bec',
  primaryHover: '#0e4bce',
  primaryLight: 'rgba(19, 91, 236, 0.1)',
  background: '#f6f6f8',
  surface: '#ffffff',
  surfaceDark: '#1a2233',
  textPrimary: '#111318',
  textSecondary: '#616f89',
  border: '#e5e7eb',
  borderLight: '#f0f2f4',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
};

const borderRadius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
};

const shadows = {
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  floating: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
  primaryGlow: '0 10px 40px -10px rgba(19, 91, 236, 0.3)',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryHover,
      light: colors.primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.textSecondary,
      light: colors.borderLight,
      dark: colors.surfaceDark,
      contrastText: '#ffffff',
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    success: {
      main: colors.success,
      contrastText: '#ffffff',
    },
    error: {
      main: colors.error,
      contrastText: '#ffffff',
    },
    warning: {
      main: colors.warning,
      contrastText: '#ffffff',
    },
    divider: colors.border,
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1920,
    },
  },
  shadows: [
    'none',
    shadows.card,
    shadows.soft,
    shadows.floating,
    shadows.primaryGlow,
    shadows.card,
    shadows.soft,
    shadows.floating,
    shadows.card,
    shadows.soft,
    shadows.floating,
    shadows.card,
    shadows.soft,
    shadows.floating,
    shadows.card,
    shadows.soft,
    shadows.floating,
    shadows.card,
    shadows.soft,
    shadows.floating,
    shadows.card,
    shadows.soft,
    shadows.floating,
    shadows.card,
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          boxShadow: shadows.card,
          border: `1px solid ${colors.borderLight}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: colors.primaryHover,
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
          borderRadius: borderRadius.md,
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: shadows.card,
        },
        elevation2: {
          boxShadow: shadows.soft,
        },
        elevation3: {
          boxShadow: shadows.floating,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.sm,
            backgroundColor: colors.surface,
            '& fieldset': {
              borderColor: colors.border,
            },
            '&:hover fieldset': {
              borderColor: colors.primary,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          '&:hover': {
            backgroundColor: colors.primaryLight,
          },
        },
      },
    },
  },
});

export { colors, borderRadius, shadows };
