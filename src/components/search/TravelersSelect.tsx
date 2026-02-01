import { useState } from 'react';
import {
  Box,
  Button,
  Popover,
  IconButton,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Icon from '../common/Icon';

interface TravelersSelectProps {
  passengers: number;
  cabinClass: string;
  onPassengersChange: (count: number) => void;
  onCabinClassChange: (cabinClass: string) => void;
  variant?: 'desktop' | 'mobile';
}

const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First'];

function TravelersSelect({
  passengers,
  cabinClass,
  onPassengersChange,
  onCabinClassChange,
  variant,
}: TravelersSelectProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const displayVariant = variant || (isMobile ? 'mobile' : 'desktop');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const displayText = `${passengers} Traveler${passengers > 1 ? 's' : ''}, ${cabinClass}`;

  const handleIncrement = () => {
    if (passengers < 9) {
      onPassengersChange(passengers + 1);
    }
  };

  const handleDecrement = () => {
    if (passengers > 1) {
      onPassengersChange(passengers - 1);
    }
  };

  const handleCabinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCabinClassChange(event.target.value);
  };

  const TriggerButton = displayVariant === 'mobile' ? (
    <Button
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '48px',
        paddingX: '12px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#f3f4f6',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon name="group" size="md" className="travelers-icon-mobile" />
        <style>
          {`
            .travelers-icon-mobile {
              color: #94a3b8;
            }
          `}
        </style>
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#111318',
          }}
        >
          {displayText}
        </Typography>
      </Box>
      <Icon name="expand_more" size="md" className="expand-icon-mobile" />
      <style>
        {`
          .expand-icon-mobile {
            color: #94a3b8;
          }
        `}
      </style>
    </Button>
  ) : (
    <Button
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingX: '12px',
        paddingY: '8px',
        borderRadius: '8px',
        textTransform: 'none',
        minWidth: 'auto',
        '&:hover': {
          backgroundColor: '#f0f2f4',
        },
      }}
    >
      <Icon name="group" size="md" className="travelers-icon-desktop" />
      <style>
        {`
          .travelers-icon-desktop {
            color: #9ca3af;
          }
        `}
      </style>
      <Typography
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#111318',
        }}
      >
        {displayText}
      </Typography>
      <Icon name="expand_more" size="sm" className="expand-icon-desktop" />
      <style>
        {`
          .expand-icon-desktop {
            color: #9ca3af;
          }
        `}
      </style>
    </Button>
  );

  return (
    <>
      {TriggerButton}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            marginTop: '8px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            minWidth: '320px',
            maxWidth: '400px',
          },
        }}
      >
        <Box sx={{ padding: '20px' }}>
          {/* Passengers Section */}
          <Box sx={{ marginBottom: '24px' }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#616f89',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Passengers
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: '#111318',
                }}
              >
                Adults (12+)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconButton
                  onClick={handleDecrement}
                  disabled={passengers <= 1}
                  sx={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#f6f6f8',
                    },
                    '&.Mui-disabled': {
                      borderColor: '#f0f2f4',
                      opacity: 0.5,
                    },
                  }}
                >
                  <Icon name="remove" size="sm" className="counter-icon" />
                  <style>
                    {`
                      .counter-icon {
                        color: #111318;
                      }
                    `}
                  </style>
                </IconButton>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#111318',
                    minWidth: '24px',
                    textAlign: 'center',
                  }}
                >
                  {passengers}
                </Typography>
                <IconButton
                  onClick={handleIncrement}
                  disabled={passengers >= 9}
                  sx={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#f6f6f8',
                    },
                    '&.Mui-disabled': {
                      borderColor: '#f0f2f4',
                      opacity: 0.5,
                    },
                  }}
                >
                  <Icon name="add" size="sm" className="counter-icon" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Cabin Class Section */}
          <Box sx={{ marginBottom: '24px' }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#616f89',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Cabin Class
            </Typography>
            <RadioGroup value={cabinClass} onChange={handleCabinChange}>
              {CABIN_CLASSES.map((className) => (
                <FormControlLabel
                  key={className}
                  value={className}
                  control={
                    <Radio
                      sx={{
                        color: '#e5e7eb',
                        '&.Mui-checked': {
                          color: '#135bec',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: '#111318',
                      }}
                    >
                      {className}
                    </Typography>
                  }
                  sx={{
                    marginBottom: '4px',
                    '&:last-child': {
                      marginBottom: 0,
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </Box>

          {/* Done Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleClose}
            sx={{
              height: '44px',
              backgroundColor: '#135bec',
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#0e4bce',
                boxShadow: '0 4px 12px rgba(19, 91, 236, 0.2)',
              },
            }}
          >
            Done
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default TravelersSelect;
