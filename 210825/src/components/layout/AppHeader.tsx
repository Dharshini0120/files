"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Menu, X } from "lucide-react";

type MenuItem = { name: string; path: string };

const menuItems: MenuItem[] = [
  { name: "Home", path: "/home" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const AppHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();

  const isActive = useCallback(
    (path: string) => pathname === path || (path === "/home" && pathname === "/"),
    [pathname]
  );

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((p) => !p);
  }, []);

  const handleSignInClick = useCallback(() => {
    startTransition(() => {
      router.push("/auth/signin");
    });
  }, [router]);

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, pb: 2 }}>
        <IconButton onClick={handleDrawerToggle} aria-label="Close menu">
          <X size={24} />
        </IconButton>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              prefetch
              onClick={() => setMobileOpen(false)}
              sx={{
                py: 1.5,
                borderBottom: isActive(item.path) ? "2px solid #3b82f6" : "2px solid transparent",
                "& .MuiTypography-root": {
                  fontWeight: isActive(item.path) ? 700 : 500,
                  color: isActive(item.path) ? "#3b82f6" : "#000000",
                  transition: "color 0.2s ease",
                },
                "&:hover": {
                  borderBottom: "2px solid #3b82f6",
                },
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem sx={{ pt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSignInClick}
            disableElevation
            sx={{
              backgroundColor: "#3b82f6",
              textTransform: "none",
              borderRadius: "8px",
              py: 1.5,
              "&:hover": {
                backgroundColor: "#2563eb",
              },
            }}
          >
            Sign In
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "10px 20px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: { xs: 6, lg: 10 },
            height: "64px",
            minHeight: "64px !important",
            px: 2,
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/home" prefetch aria-label="Go to home">
              <Image
                src="/medical-logo.png"
                alt="Company Logo"
                width={160}
                height={40}
                priority
                onError={(e) => {
                  e.currentTarget.src = "/Company-Logo.png";
                }}
                style={{ height: "auto", width: "auto", maxHeight: 50 }}
              />
            </Link>
          </Box>

          {/* Desktop Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: "60px",
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                href={item.path}
                prefetch
                disableRipple
                disableFocusRipple
                disableTouchRipple
                sx={{
                  color: isActive(item.path) ? "#3b82f6" : "#000000",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "20px",
                  backgroundColor: "transparent",
                  textDecoration: isActive(item.path) ? "underline" : "none",
                  textUnderlineOffset: "4px", // moves underline away from text
                  textDecorationThickness: "2px", // thicker underline
                  transition: "color 0.2s ease",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#3b82f6",
                    textDecoration: "underline",
                  },
                }}
                  
              >
                {item.name}
              </Button>
            ))}

            <Button
              variant="contained"
              onClick={handleSignInClick}
              disableElevation
              sx={{
                backgroundColor: "#3b82f6",
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                fontSize: "20px",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{
              display: { xs: "block", md: "none" },
              color: "#1f2937",
              marginLeft: "auto",
              marginRight: "8px",
            }}
            onClick={handleDrawerToggle}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AppHeader;