import { AccountCircle } from "@mui/icons-material";
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import React from "react";
import { FrontEndRoutes } from "../../constants/Constants";

interface NavbarProps {
    appBarHeight: string,
    appBarWidth: string,
    appBarBgColor: string,
    appBarBorderRadius: string,
    iconHeight: string,
    iconWidth: string,
    iconMl: number,
    iconColor: string,
    menuHeight: string,
    menuWidth: string,
    menuItemHeight: string,
    menuItemWidth: string
}

export function Navbar(props: NavbarProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        localStorage.removeItem('id')
        localStorage.removeItem('token')
        localStorage.removeItem('admin')
        localStorage.removeItem('logged')
        window.location.href = FrontEndRoutes.LOGIN_ROUTE;
    }

    return (
        <AppBar sx={{ height: props.appBarHeight, bgcolor: props.appBarBgColor, borderRadius: props.appBarBorderRadius, width: props.appBarWidth }}>
            <Toolbar>
                <Typography variant='h6' sx={{ position: 'absolute', top: '25%', color: 'black' }}>Board</Typography>
                <IconButton
                    sx={{
                        height: props.iconHeight,
                        width: props.iconWidth,
                        ml: props.iconMl
                    }}
                //onClick={handleMenu}
                >
                    <NotificationsIcon sx={{ color: props.iconColor }} />
                </IconButton>
                <IconButton
                    sx={{
                        height: props.iconHeight,
                        width: props.iconWidth
                    }}
                //onClick={handleMenu}
                >
                    <MessageIcon sx={{ color: props.iconColor }} />
                </IconButton>
                <IconButton
                    sx={{
                        height: props.iconHeight,
                        width: props.iconWidth
                    }}
                    onClick={handleMenu}
                >
                    <AccountCircle sx={{ color: props.iconColor }} />
                </IconButton>
                <Menu
                    sx={{ width: props.menuWidth, height: props.menuHeight }}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem sx={{ height: props.menuItemHeight, width: props.menuItemWidth }} divider={true} dense={true} onClick={handleClose}>Profile</MenuItem>
                    <MenuItem sx={{ height: props.menuItemHeight, width: props.menuItemWidth }} dense={true} onClick={handleLogOut}>Log out</MenuItem>
                </Menu>

            </Toolbar>
        </AppBar>
    )
}