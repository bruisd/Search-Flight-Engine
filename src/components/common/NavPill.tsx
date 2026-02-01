import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

interface NavPillProps {
  items: Array<{
    label: string;
    icon: string;
    href: string;
    isActive?: boolean;
  }>;
  onChange?: (index: number) => void;
}

function NavPill({ items, onChange }: NavPillProps) {
  const navigate = useNavigate();

  const handleClick = (index: number, href: string) => {
    if (onChange) {
      onChange(index);
    } else {
      navigate(href);
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: '9999px',
        backgroundColor: '#f0f2f4',
        padding: '4px',
      }}
    >
      {items.map((item, index) => (
        <Box
          key={index}
          component="a"
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            handleClick(index, item.href);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '9999px',
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: item.isActive ? 600 : 500,
            color: item.isActive ? '#111318' : '#616f89',
            backgroundColor: item.isActive ? '#ffffff' : 'transparent',
            boxShadow: item.isActive ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              color: item.isActive ? '#111318' : '#111318',
              backgroundColor: item.isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          <Icon
            name={item.icon}
            className={`nav-pill-icon-${index}`}
          />
          <style>
            {`
              .nav-pill-icon-${index} {
                font-size: 18px !important;
                color: inherit;
              }
            `}
          </style>
          {item.label}
        </Box>
      ))}
    </Box>
  );
}

export default NavPill;
