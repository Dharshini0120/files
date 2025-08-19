/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useState } from "react";
import { SharedDashboardHeader } from "@frontend/shared-ui";
import { SharedDashboardDrawer } from "@frontend/shared-ui";
import { Box, Toolbar } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { ArrowBack, HelpOutline, MenuOpen } from "@mui/icons-material";
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Person2Icon from '@mui/icons-material/Person2';
import { User2Icon } from 'lucide-react';

const navigationItems1 = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Admin Management', icon: <Person2Icon />, path: '/admin-users' },
    { text: 'Hospital Management', icon: <Person2Icon />, path: '/hospital-users' },
   { text: 'Templates', icon: <AccountTreeIcon />, path: '/templates' },
  { text: 'Assessment Records ', icon: <ViewListIcon />, path: '/assessment' },
  { text: 'Roles & Access', icon: <SupervisorAccountIcon />, path: '/role-access' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/setting' },
  { text: 'Help', icon: <HelpOutline />, path: '/help' },
];


const navigationItems2 = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Assessment Records ', icon: <ViewListIcon />, path: '/assessment' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/setting' },
  { text: 'Help', icon: <HelpOutline />, path: '/help' },
];

const DashboardLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);



  const navigationItems = navigationItems1;

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
