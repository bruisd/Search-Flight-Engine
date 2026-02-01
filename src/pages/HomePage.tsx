import { Box, Container, Typography } from '@mui/material';
import { Header } from '../components/common';
import { SearchForm, type SearchParams } from '../components/search';

function HomePage() {
  const handleSearch = (params: SearchParams) => {
    console.log('Search params:', params);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f6f6f8',
      }}
    >
      <Header variant="homepage" />

      {/* Hero Section */}
      <Box
        sx={{
          paddingTop: { xs: '40px', md: '60px', lg: '80px' },
          paddingBottom: { xs: '40px', md: '60px', lg: '80px' },
        }}
      >
        <Container maxWidth="lg">
          {/* Title */}
          <Box
            sx={{
              textAlign: 'center',
              marginBottom: { xs: '32px', md: '40px', lg: '48px' },
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                fontWeight: 800,
                color: '#111318',
                marginBottom: '16px',
                lineHeight: 1.2,
              }}
            >
              Find Your Perfect Flight
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                fontWeight: 500,
                color: '#616f89',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Search and compare flights from hundreds of airlines to find the best deals
            </Typography>
          </Box>

          {/* Search Form */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <SearchForm onSearch={handleSearch} />
          </Box>
        </Container>
      </Box>

      {/* Optional: Popular Destinations Section */}
      <Box
        sx={{
          paddingY: { xs: '40px', md: '60px' },
          backgroundColor: '#ffffff',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '1.75rem', lg: '2rem' },
              fontWeight: 700,
              color: '#111318',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Popular Destinations
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              color: '#616f89',
              textAlign: 'center',
            }}
          >
            Explore trending destinations and find great deals
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
