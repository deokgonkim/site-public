import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormLabel,
  Grid2,
  List,
  ListItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { logout } from '../api';
import { toHumanReadable } from '../util/date';
import shopApi, { GUEST_URL_BASE } from '../shopApi';
import { Helmet } from 'react-helmet';
import { getCurrentShopUid } from '../session';
import { useSnackbar } from 'notistack';
import ShopEditCard from './account/shopCard';
import { Link } from 'react-router-dom';
import { NotificationSettingCard } from './account/notificationSettingCard';
import { MyAccountCard } from './account/myAccountCard';

export const AccountPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await shopApi.getProfile();
      setProfile(data);

      const currentShopUid = getCurrentShopUid();
      let shop;
      if (!currentShopUid) {
        shop = data?.userShops?.[0]?.shop;
      } else {
        shop = data?.userShops?.find((s) => s.shopUid === currentShopUid)?.shop;
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <Helmet>
        <title>Account Page</title>
        <meta name="description" content="This is a account page" />
      </Helmet>
      <Container
        sx={{
          padding: 2,
        }}
      >
        <Typography variant="h5">Account</Typography>
        <Box
          sx={{
            marginTop: '1em',
            display: { xs: 'block', md: 'flex' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: '1em',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              marginTop: { xs: '1em', md: 0 },
              width: { xs: '100%', md: '50%' },
            }}
          >
            <CardContent>
              <Typography variant="h6">Welcome! {profile?.username}</Typography>
              <Typography>My Shop URL:</Typography>
              <Link
                to={`${GUEST_URL_BASE}/${getCurrentShopUid()}`}
                target={'_blank'}
              >
                {GUEST_URL_BASE}/{getCurrentShopUid()}
              </Link>
            </CardContent>
          </Card>
          <MyAccountCard
            profile={profile}
            variant="outlined"
            sx={{
              marginTop: { xs: '1em', md: 0 },
              width: { xs: '100%', md: '50%' },
            }}
          />
        </Box>
        <Box
          sx={{
            marginTop: '1em',
            display: { xs: 'block', md: 'flex' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: '1em',
          }}
        >
          <ShopEditCard
            variant="outlined"
            sx={{
              marginTop: { xs: '1em', md: 0 },
              width: { xs: '100%', md: '50%' },
            }}
          />
          <NotificationSettingCard
            variant="outlined"
            sx={{
              marginTop: { xs: '1em', md: 0 },
              width: { xs: '100%', md: '50%' },
            }}
          />
        </Box>
        <Button
          sx={{
            marginTop: 2,
          }}
          variant="contained"
          onClick={logout}
        >
          Logout
        </Button>
      </Container>
    </>
  );
};
