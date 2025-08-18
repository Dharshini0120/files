/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItemIcon,
    ListItemText,
    Theme,
    Toolbar,
    Typography,
    useTheme,
    Divider,
    ListItemButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { ArrowBack, HelpOutline, MenuOpen } from "@mui/icons-material";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { User2Icon } from 'lucide-react';

const drawerWidth = 300;

const navigationItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'User Management', icon: <User2Icon />, path: '/users' },
    { text: 'Assessments', icon: <AssessmentIcon />, path: '/assessment' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/setting' },
    { text: 'Help', icon: <HelpOutline />, path: '/help' },
];

export default function AppDrawer() {
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                width: open ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                [`& .MuiDrawer-paper`]: {
                    backgroundColor: theme.palette.background.default,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    ...(open ? openedMixin(theme) : closedMixin(theme)),
                },
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: [2],
                    minHeight: '64px'
                }}
            >
                {open && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                            Logo
                        </Typography>
                    </Box>
                )}
                {/* <IconButton onClick={handleDrawerToggle}>
                    {open ? <ArrowBack /> : <MenuOpen />}
                </IconButton> */}
            </Toolbar>
            <Divider />
            <List sx={{ px: 2, py: 1 }}>
                {navigationItems.map((item, index) => (
                    <React.Fragment key={item.text}>
                        <ListItemButton
                            onClick={() => router.push(item.path)}
                            sx={{
                                borderRadius: '8px',
                                mb: 0.5,
                                backgroundColor: pathname === item.path ? theme.palette.primary.light : 'transparent',
                                color: pathname === item.path ? theme.palette.text.secondary : theme.palette.text.primary,
                                '&:hover': {
                                    backgroundColor: pathname === item.path
                                        ? theme.palette.primary.light
                                        : theme.palette.action.hover,
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    color: pathname === item.path ? theme.palette.text.secondary : 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontWeight: pathname === item.path ? 600 : 400,
                                    },
                                }}
                            />
                        </ListItemButton>
                        {index === 2 && <Divider sx={{ my: 2 }} />}
                    </React.Fragment>
                ))}
            </List>
            <Box sx={{
                marginTop: 'auto',
                p: 2,
                textAlign: 'center',
                borderTop: `1px solid ${theme.palette.divider}`,
            }}>
                <Typography variant="body2" color="textPrimary">
                    © {new Date().getFullYear()} Medical Assessment
                </Typography>
            </Box>
        </Drawer>
    );
}

interface MixinProps {
    width: number | string;
    transition: string;
    overflowX: 'hidden' | 'auto' | 'visible' | 'scroll';
    [key: string]: any;
}

const openedMixin = (theme: Theme): MixinProps => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): MixinProps => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});
