"use client";
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from "@mui/material";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";


const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const handleProfileClick = () => {
    handleCloseUserMenu();
    try {
      const token = Cookies.get('jwt');
      if (!token) {
        router.push('/login');
        return;
      }
      const data = jwtDecode(token);
      const id = data?.id;
      if (!id) {
        console.error('No se pudo obtener el ID del usuario del token');
        router.push('/login');
        return;
      }
      router.push(`/user/${id}/profile`);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      router.push('/login');
    }
  };

  const handleLogoClick = () => {
    router.push('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.setItem('logout', 'true');
    Cookies.remove("jwt")
    router.push('/login');
  }

  return (
    <AppBar
    position="static"
    sx={{ backgroundColor: '#00CC66', margin: '0px', position: 'sticky', top: 0, paddingLeft: '20px',  paddingRight: '20px', zIndex: 1 }}
    >
    <div 
    style={{
      margin:0,
      paddingRight: 0,
      paddingLeft: 0,
    }}
    >
        <Toolbar disableGutters>
          <IconButton onClick={handleLogoClick} color="inherit">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={62}
              height={62}
              top={9}
              left={10}
              border={2}
              onClick={handleLogoClick}
              sx={{ cursor: 'pointer', mr: 2, display: { xs: 'none', md: 'flex' }, border: 1, opacity: 1 }}
            />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Image
              src="/assets/images/usericon.png"
              alt="usericon"
              width={51}
              height={51}
              top={12}
              left={1374}
              border={2}
              onClick={handleOpenUserMenu}
              sx={{ cursor: 'pointer', mr: 2, display: { xs: 'none', md: 'flex' }, border: 1, opacity: 1 }}
            />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={handleProfileClick}>
                    Mi perfil
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                    Cerrar Sesion
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
        </div>
    </AppBar>
  );
};

export default ResponsiveAppBar;
