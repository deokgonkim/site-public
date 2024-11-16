import {
  Box,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useState } from 'react';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { Menu as MenuIcon } from '@mui/icons-material';
import Face6Icon from '@mui/icons-material/Face6';
import { getFcmToken, registerServiceWorker } from '../external/firebase';
import shopApi from '../shopApi';
import { setCurrentShopUid } from '../session';

export const MainLayout = () => {
  const navigate = useNavigate();
  const accountPage = window.location.pathname === '/shop/account';
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
      label: 'Customers',
      icon: <Face6Icon />,
      onClick: () => {
        console.log('Customers Clicked');
        navigate('/customers');
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

  const [myShops, setMyShops] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const enablePushNotication = () => {
    registerServiceWorker().then((swRegistration) => {
      getFcmToken(swRegistration).then((token) => {
        console.log(token);
        if (token && token.length > 0) {
          // fcmApi.registerFcmToken(token).then((response) => {
          //   console.log(response);
          //   enqueueSnackbar('FCM Token registered', { variant: 'success' });
          // });
          shopApi.registerFcmToken(token).then((response) => {
            console.log(response);
            enqueueSnackbar('FCM Token registered, Refreshing required', {
              variant: 'success',
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          });
        }
        // enqueueSnackbar('FCM Token: ' + token, { variant: 'success' });
      });
    });
  };

  const switchShop = (shopUid) => () => {
    console.log('Switch Shop', shopUid);
    setAnchorEl(null);
    setCurrentShopUid(shopUid);
    enqueueSnackbar(`Switched to shop ${shopUid}`, {
      variant: 'info',
    });
    // trigger reload
    document.location.reload();
  };

  // https://dev.to/nirazanbasnet/dont-use-100vh-for-mobile-responsive-3o97
  const documentHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', documentHeight);
  documentHeight();

  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchMyShops = async () => {
      const data = await shopApi.getMyShops();
      setMyShops(data);
    };
    fetchMyShops();
    registerServiceWorker();
  }, []);

  return (
    <Container
      style={{
        // minHeight: '100vh',
        height: 'calc(var(--doc-height) - env(safe-area-inset-bottom, 45px))',
        display: 'flex',
        flexDirection: 'column',
        // border: '1px solid black',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          {accountPage && (
            <>
              <IconButton onClick={handleMenu}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>Choose My Shop</MenuItem>
                {myShops.map((userShop, index) => {
                  return (
                    <MenuItem
                      key={index}
                      onClick={switchShop(userShop.shop?.shopUid)}
                    >
                      {userShop.shop?.shopUid}
                    </MenuItem>
                  );
                })}
                <Divider />
                <MenuItem onClick={enablePushNotication}>
                  Enable Push Notification
                </MenuItem>
                <Divider />
                <MenuItem
                  color="error"
                  onClick={(event) => {
                    document.location.reload();
                  }}
                >
                  Reload
                </MenuItem>
              </Menu>
            </>
          )}
          <Typography variant="h6">My Shop</Typography>
        </Toolbar>
      </AppBar>
      <SnackbarProvider>
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </Box>
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
