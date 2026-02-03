import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import Logo from "./Logo";
import NavPill from "./NavPill";
import Icon from "./Icon";

interface HeaderProps {
  variant?: "homepage" | "results";
  transparent?: boolean;
}

const NAV_ITEMS = [
  { label: "Flights", icon: "flight", href: "/", isActive: true },
  { label: "Hotels", icon: "hotel", href: "/hotels", isActive: false },
  { label: "Cars", icon: "directions_car", href: "/cars", isActive: false },
  { label: "Deals", icon: "local_offer", href: "/deals", isActive: false },
];

function Header({ transparent = false }: HeaderProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavChange = (index: number) => {
    console.log("Nav item clicked:", index);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: transparent
          ? "rgba(255, 255, 255, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e5e7eb",
        zIndex: 50,
      }}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: { xs: "16px 24px", lg: "16px 40px" },
          minHeight: { xs: "64px", lg: "72px" },
          position: "relative",
        }}>
        {/* Left: Logo */}
        <Box sx={{ display: "flex", alignItems: "center", zIndex: 1 }}>
          <Logo variant={isMobile ? "mobile" : "desktop"} />
        </Box>

        {/* Center: Navigation Pills (Desktop only) - absolutely centered */}
        {isDesktop && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}>
            <NavPill items={NAV_ITEMS} onChange={handleNavChange} />
          </Box>
        )}

        {/* Right: Mobile Menu Icon (Mobile only) */}
        <Box sx={{ display: "flex", alignItems: "center", zIndex: 1 }}>
          {!isDesktop && (
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                color: "#111318",
                padding: "8px",
              }}>
              <Icon name={mobileMenuOpen ? "close" : "menu"} size="lg" />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Menu (could be expanded later) */}
      {!isDesktop && mobileMenuOpen && (
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e5e7eb",
            padding: "16px 24px",
          }}>
          {/* Mobile navigation items would go here */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {NAV_ITEMS.map((item, index) => (
              <Button
                key={index}
                startIcon={<Icon name={item.icon} size="md" />}
                sx={{
                  justifyContent: "flex-start",
                  padding: "12px 16px",
                  fontSize: "0.875rem",
                  fontWeight: item.isActive ? 600 : 500,
                  color: item.isActive ? "#135bec" : "#616f89",
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#f6f6f8",
                  },
                }}>
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </AppBar>
  );
}

export default Header;
