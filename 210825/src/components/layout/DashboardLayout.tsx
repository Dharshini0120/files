"use client";
import React, { useState, useEffect } from "react";
import { SharedDashboardHeader } from "@frontend/shared-ui";
import { SharedDashboardDrawer } from "@frontend/shared-ui";
import { Box, Toolbar } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { ArrowBack, HelpOutline, MenuOpen } from "@mui/icons-material";
import { User2Icon } from 'lucide-react';

const navigationItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Assessments', icon: <AssessmentIcon />, path: '/assessment' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Help', icon: <HelpOutline />, path: '/help' },
];

const DashboardLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <SharedDashboardHeader open={drawerOpen} onToggle={setDrawerOpen} />
      <SharedDashboardDrawer navigationItems={navigationItems} open={drawerOpen} onToggle={setDrawerOpen} />
      {/* Drawer content goes here */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          backgroundColor: "#f9fbfc",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box sx={{ padding: 4 }}>{children}</Box>
      </Box>

    </Box>


  );
};

export default DashboardLayout;
