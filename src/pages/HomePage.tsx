import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header, Icon } from '../components/common';
import { SearchForm } from '../components/search';
import type { Airport } from '../components/search/AirportAutocomplete';
import { formatPrice } from '../utils/formatters';

interface Destination {
  city: string;
  country: string;
  price: number;
  image: string;
}

const POPULAR_DESTINATIONS: Destination[] = [
  {
    city: 'Punta Cana',
    country: 'Dominican Republic',
    price: 450,
    image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&h=1000&fit=crop',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    price: 890,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=1000&fit=crop',
  },
  {
    city: 'Paris',
    country: 'France',
    price: 520,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=1000&fit=crop',
  },
  {
    city: 'Venice',
    country: 'Italy',
    price: 610,
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=1000&fit=crop',
  },
];

interface DestinationCardProps {
  destination: Destination;
  variant?: 'desktop' | 'mobile';
}

function DestinationCard({ destination, variant = 'desktop' }: DestinationCardProps) {
  const isMobile = variant === 'mobile';

  if (isMobile) {
    return (
      <Box
        sx={{
          minWidth: '200px',
          flexShrink: 0,
          cursor: 'pointer',
          scrollSnapAlign: 'start',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '200px',
            height: '128px',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '12px',
            '&:hover img': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Box
            component="img"
            src={destination.image}
            alt={destination.city}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
          />
          {/* Gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
            }}
          />
          {/* Price badge */}
          <Box
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(19, 91, 236, 0.9)',
              color: '#ffffff',
              paddingX: '8px',
              paddingY: '4px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            From {formatPrice(destination.price)}
          </Box>
        </Box>
        {/* Info */}
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
            {destination.city}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            {destination.country}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Desktop card
  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio: '3/4',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover img': {
          transform: 'scale(1.1)',
        },
      }}
    >
      <Box
        component="img"
        src={destination.image}
        alt={destination.city}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
        }}
      />
      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
        }}
      />
      {/* Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
        }}
      >
        <Typography
          sx={{
            color: '#ffffff',
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '4px',
          }}
        >
          {destination.city}
        </Typography>
        <Typography
          sx={{
            color: '#e5e7eb',
            fontSize: '0.875rem',
            marginBottom: '12px',
          }}
        >
          {destination.country}
        </Typography>
        <Box
          sx={{
            backgroundColor: 'rgba(19, 91, 236, 0.9)',
            color: '#ffffff',
            paddingX: '12px',
            paddingY: '6px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'inline-block',
          }}
        >
          From {formatPrice(destination.price)}
        </Box>
      </Box>
    </Box>
  );
}

function TrustBadges() {
  const badges = [
    { icon: 'verified_user', text: 'Trusted Booking' },
    { icon: 'price_check', text: 'Best Price Guarantee' },
    { icon: 'support_agent', text: '24/7 Support' },
  ];

  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'flex' },
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: { md: '40px', lg: '80px' },
        opacity: 0.6,
        filter: 'grayscale(100%)',
        transition: 'all 0.3s',
        marginTop: '80px',
        marginBottom: '80px',
        '&:hover': {
          opacity: 1,
          filter: 'grayscale(0%)',
        },
      }}
    >
      {badges.map((badge) => (
        <Box
          key={badge.icon}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name={badge.icon} className="trust-icon" />
          <style>
            {`
              .trust-icon {
                font-size: 30px !important;
              }
            `}
          </style>
          <Typography sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
            {badge.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleSearch = (searchData: {
    origin: Airport | null;
    destination: Airport | null;
    departureDate: Date | null;
    returnDate: Date | null;
    passengers: number;
    cabinClass: string;
    tripType: 'one-way' | 'round-trip' | 'multi-city';
  }) => {
    // Validate required fields
    if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
      console.error('Missing required search fields');
      return;
    }

    // Build query params
    const params = new URLSearchParams({
      origin: searchData.origin.code,
      destination: searchData.destination.code,
      departureDate: searchData.departureDate.toISOString().split('T')[0],
      passengers: searchData.passengers.toString(),
      cabinClass: searchData.cabinClass,
      tripType: searchData.tripType,
    });

    // Add return date for round-trip
    if (searchData.tripType === 'round-trip' && searchData.returnDate) {
      params.append('returnDate', searchData.returnDate.toISOString().split('T')[0]);
    }

    // Navigate to search results page
    navigate(`/search?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f6f6f8',
        animation: 'fadeIn 0.5s ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      {/* Header */}
      <Header transparent={false} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingX: { xs: 0, md: '24px' },
          paddingBottom: '80px',
        }}
      >
        {/* Hero Section */}
        {isMobile ? (
          <Box sx={{ paddingX: '20px', paddingTop: '24px', paddingBottom: '8px' }}>
            <Typography
              component="h2"
              sx={{
                fontSize: '1.875rem',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Find your next{' '}
              <Box component="br" />
              <Box component="span" sx={{ color: '#135bec' }}>
                adventure
              </Box>
            </Typography>
            <Typography
              sx={{
                marginTop: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#64748b',
              }}
            >
              Explore the world at the best prices.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              maxWidth: '960px',
              textAlign: 'center',
              marginBottom: '32px',
              marginTop: '16px',
            }}
          >
            <Typography
              component="h1"
              sx={{
                letterSpacing: '-0.02em',
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '12px',
              }}
            >
              Find your next adventure
            </Typography>
            <Typography
              sx={{
                color: '#616f89',
                fontSize: '1.125rem',
              }}
            >
              Discover the best flight deals to over 5,000 destinations worldwide.
            </Typography>
          </Box>
        )}

        {/* Search Form */}
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', md: '1152px' },
            paddingX: { xs: '20px', md: 0 },
            marginBottom: { xs: '40px', md: '64px' },
          }}
        >
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: { xs: '16px', md: '20px' },
              boxShadow: {
                xs: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                md: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              },
              padding: { xs: '20px', md: '32px' },
            }}
          >
            <SearchForm onSearch={handleSearch} />
          </Box>
        </Box>

        {/* Popular Destinations */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1152px',
            marginTop: { xs: '32px', md: '64px' },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingX: { xs: '20px', md: 0 },
            }}
          >
            <Typography
              component="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.875rem' },
                fontWeight: 700,
              }}
            >
              Popular Destinations
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{
                color: '#135bec',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              View all
            </Typography>
          </Box>

          {/* Destination Cards */}
          {isMobile ? (
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                paddingX: '20px',
                paddingBottom: '8px',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
              }}
            >
              {POPULAR_DESTINATIONS.map((destination) => (
                <DestinationCard
                  key={destination.city}
                  destination={destination}
                  variant="mobile"
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: '24px',
              }}
            >
              {POPULAR_DESTINATIONS.map((destination) => (
                <DestinationCard
                  key={destination.city}
                  destination={destination}
                  variant="desktop"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Trust Badges */}
        <TrustBadges />
      </Box>
    </Box>
  );
}

export default HomePage;
