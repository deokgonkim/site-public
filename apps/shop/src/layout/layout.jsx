import { Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

export const MainLayout = () => {
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
      <Outlet />
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        style={{ marginTop: 'auto' }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Orders" icon={<EditCalendarIcon />} />
        <BottomNavigationAction label="Account" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Container>
  );
};
