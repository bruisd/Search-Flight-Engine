import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Icon from './Icon';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: 'Flights', icon: 'flight', href: '/' },
  { label: 'Hotels', icon: 'hotel', href: '/hotels' },
  { label: 'Cars', icon: 'directions_car', href: '/cars' },
  { label: 'Deals', icon: 'local_offer', href: '/deals' },
];

function MobileMenu({ open, onClose }: MobileMenuProps) {
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    onClose();
    navigate(href);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '85%',
          maxWidth: '320px',
          backgroundColor: '#ffffff',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #f0f2f4',
          }}
        >
          <Logo variant="mobile" showText={true} onClick={onClose} />
          <IconButton
            onClick={onClose}
            sx={{
              padding: '8px',
              color: '#616f89',
              '&:hover': {
                color: '#111318',
                backgroundColor: '#f6f6f8',
              },
            }}
          >
            <Icon name="close" size="lg" />
          </IconButton>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List sx={{ padding: '16px 8px' }}>
            {NAV_ITEMS.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ marginBottom: '4px' }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.href)}
                  sx={{
                    borderRadius: '12px',
                    padding: '12px 16px',
                    '&:hover': {
                      backgroundColor: '#f6f6f8',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <Icon
                      name={item.icon}
                      size="md"
                      className={`nav-icon-${index}`}
                    />
                    <style>
                      {`
                        .nav-icon-${index} {
                          color: #135bec;
                        }
                      `}
                    </style>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#111318',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}

export default MobileMenu;
