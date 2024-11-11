import { Container, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { SnackbarProvider } from 'notistack';

export const MainLayout = () => {
  const navigate = useNavigate();
  const bottomNaviationItems = [
    {
      label: 'Home',
      icon: <HomeIcon />,
      onClick: () => {
        console.log('Home Clicked');
        navigate('/');
      },
    },
    {
      label: 'Orders',
      icon: <EditCalendarIcon />,
      onClick: () => {
        console.log('Orders Clicked');
        navigate('/orders');
      },
    },
    {
      label: 'Account',
      icon: <AccountCircleIcon />,
      onClick: () => {
        console.log('Account Clicked');
        navigate('/account');
      },
    },
  ];
  const [value, setValue] = useState(0);
  return (
    <Container
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid black',
        padding: 0,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My Shop</Typography>
        </Toolbar>
      </AppBar>
      <SnackbarProvider>
        <Outlet />
      </SnackbarProvider>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          bottomNaviationItems[newValue].onClick();
        }}
        showLabels
        style={{ marginTop: 'auto' }}
      >
        {bottomNaviationItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Container>
  );
};
