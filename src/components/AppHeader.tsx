import React, { useState } from 'react'
import {
    AppBar,
    Avatar,
    Box,
    CssBaseline,
    Divider,
    IconButton,
    InputBase,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Add this import
import { NotificationsNoneOutlined } from '@mui/icons-material';


const drawerWidth = 300;

export default function AppHeader() {
    const [open, setOpen] = useState(true);
    const theme = useTheme();

    const handleDrawerOpen = () => {
        setOpen(true);
    };


    return (
        <>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    ...(open && {
                        marginLeft: drawerWidth,
                        width: `calc(100% - ${drawerWidth}px)`,
                        transition: theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }),
                    borderBottom: '1px solid #e4e5e7',
                    boxShadow: 'none',
                }}
            >
                <Toolbar style={{ backgroundColor: '#fff', color: '#000' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{
                        position: 'relative',
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.common.black, 0.00),
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.common.black, 0.1),
                        },
                        marginRight: theme.spacing(2),
                        marginLeft: 0,
                        width: '100%',
                        [theme.breakpoints.up('sm')]: {
                            marginLeft: theme.spacing(1),
                            width: 'auto',
                        },
                        border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
                        // margin: theme.spacing(2, 2),
                    }}>
                        <Box sx={{
                            padding: theme.spacing(0, 2),
                            height: '100%',
                            position: 'absolute',
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <SearchIcon />
                        </Box>
                        <InputBase
                            placeholder="Search…"
                            sx={{
                                color: 'inherit',
                                '& .MuiInputBase-input': {
                                    padding: theme.spacing(1, 1, 1, 0),
                                    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                                    transition: theme.transitions.create('width'),
                                    width: '100%',
                                    [theme.breakpoints.up('md')]: {
                                        width: '30ch',
                                    },
                                },
                            }}
                        />
                    </Box>
                    {/* Add this Box to push the notification icon to the right */}
                    <Box sx={{ flexGrow: 1 }} />
                    {/* Add the notification icon */}
                    <IconButton
                        color="inherit"
                        aria-label="notifications"
                        sx={{
                            marginLeft: 2

                        }}
                    >
                        <NotificationsNoneOutlined sx={{ fontSize: 28 }} />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="profile"
                        sx={{
                            marginLeft: 2,
                            width: 40,
                            height: 40,
                            backgroundColor: '#fff',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.common.black, 0),
                            }
                        }}
                    >
                        <Avatar
                            alt="Profile Picture"
                            src="https://randomuser.me/api/portraits/women/26.jpg"  // Replace with actual path
                            sx={{ width: 45, height: 45, borderRadius: '8px' }}  // Adjust size as needed
                            variant='square'
                        />
                    </IconButton>
                    <Box sx={{ marginLeft: 2, paddingRight: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            Jane Stacy
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.primary' }}>
                            Admin
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}
