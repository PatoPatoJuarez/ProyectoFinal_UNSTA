import React, { useState } from 'react';
import NotificationBell from './NotificationBell'; // Ajusta la ruta si hace falta
import PerfilRefugio from '../Pages/perfilRefugio';
import PerfilAdoptante from '../Pages/perfilAdoptante';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import SettingsIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/LogoMYP2.png';

const Header = ({ onConfigClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const handleThemeToggle = () => {
    alert('Tema cambiado (simulado)');
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(60, 46, 40, 0.88)' }}>
      <Toolbar sx={{ px: 2 }}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: '85px', marginRight: '12px' }}
        />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Hands & Paws
        </Typography>

        {/* Aquí se muestra el ícono de notificaciones con contador */}
        <NotificationBell token={token} />

        {/* Botón menú */}
        <IconButton
          color="inherit"
          size="small"
          onClick={handleMenuClick}
          sx={{
            ml: 'auto',
            p: 0.5,
            minWidth: 0,
            width: '32px',
            height: '32px'
          }}
        >
          <MenuIcon fontSize="medium" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleThemeToggle}>
            <Brightness4Icon sx={{ mr: 1 }} /> Cambiar tema
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();

              const user = JSON.parse(localStorage.getItem('usuario'));

              if (user?.rol === 'refugio') {
                navigate('/perfilRefugio');
              } else if (user?.rol === 'adoptante') {
                navigate('/perfilAdoptante');
              } else {
                navigate('/');
              }
            }}
          >
            <SettingsIcon sx={{ mr: 1 }} /> Usuario
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} /> Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
