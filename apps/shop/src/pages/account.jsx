import {
  Button,
  Card,
  CardActionArea,
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
import shopApi from '../shopApi';
import { Helmet } from 'react-helmet';
import { getCurrentShopUid } from '../session';
import { useSnackbar } from 'notistack';

export const AccountPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [profile, setProfile] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({});

  const updateShop = () => {
    shopApi
      .updateShop(getCurrentShopUid(), {
        telegramId:
          notificationSettings?.telegramId?.length > 0
            ? notificationSettings?.telegramId
            : null,
        useTelegram:
          (notificationSettings.telegramId &&
            notificationSettings?.useTelegram) ||
          false,
        whatsappId:
          notificationSettings?.whatsappId?.length > 0
            ? notificationSettings?.whatsappId
            : null,
        useWhatsapp:
          (notificationSettings?.whatsappId &&
            notificationSettings?.useWhatsapp) ||
          false,
      })
      .then((newShop) => {
        enqueueSnackbar('Shop updated', { variant: 'success' });
      });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await shopApi.getProfile();

      const shop = data?.userShops?.[0]?.shop;
      if (shop) {
        setNotificationSettings({
          telegramId: shop.telegramId,
          useTelegram: shop.useTelegram,
          whatsappId: shop.whatsappId,
          useWhatsapp: shop.useWhatsapp,
        });
        console.log(notificationSettings);
      }

      setProfile(data);
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
        <Typography variant="h6">Welcome! {profile?.username}</Typography>
        <Divider />
        <List>
          <ListItem>
            <FormLabel sx={{ marginRight: 1 }}>Email</FormLabel>
            <Typography>{profile?.email}</Typography>
          </ListItem>
          <ListItem>
            <FormLabel sx={{ marginRight: 1 }}>Phone</FormLabel>
            <Typography>{profile?.phone}</Typography>
          </ListItem>
          <ListItem>
            <FormLabel sx={{ marginRight: 1 }}>Joined At</FormLabel>
            <Typography>{toHumanReadable(profile?.createdAt)}</Typography>
          </ListItem>
        </List>
        <Divider />
        <Card variant="outlined" sx={{ marginTop: '0.5em', padding: '0.5em' }}>
          <CardHeader title="Notification Settings" />
          <CardContent>
            <List>
              <ListItem>
                <Grid2 container spacing={2} style={{ width: '100%' }}>
                  <Grid2 item size={4}>
                    <FormLabel sx={{ marginRight: 1 }}>Telegram ID</FormLabel>
                  </Grid2>
                  <Grid2 item size={4}>
                    <TextField
                      size="small"
                      variant="outlined"
                      sx={{ padding: 0 }}
                      value={notificationSettings.telegramId || ''}
                      onChange={(e) => {
                        setNotificationSettings((prev) => {
                          return {
                            ...prev,
                            telegramId: e.target.value,
                          };
                        });
                        if (e.target.value.length === 0) {
                          setNotificationSettings((prev) => {
                            return {
                              ...prev,
                              useTelegram: false,
                            };
                          });
                        }
                      }}
                    />
                  </Grid2>
                  <Grid2 item size={4}>
                    <Switch
                      checked={notificationSettings?.useTelegram}
                      disabled={!notificationSettings?.telegramId}
                      onChange={(e) => {
                        setNotificationSettings((prev) => {
                          return {
                            ...prev,
                            useTelegram: e.target.checked,
                          };
                        });
                      }}
                    />
                  </Grid2>
                </Grid2>
              </ListItem>
              <ListItem>
                <Grid2 container spacing={2} style={{ width: '100%' }}>
                  <Grid2 item size={4}>
                    <FormLabel sx={{ marginRight: 1 }}>Whatsapp ID</FormLabel>
                  </Grid2>
                  <Grid2 item size={4}>
                    <TextField
                      size="small"
                      variant="outlined"
                      sx={{ padding: 0 }}
                      value={notificationSettings.whatsappId || ''}
                      onChange={(e) => {
                        setNotificationSettings((prev) => {
                          return {
                            ...prev,
                            whatsappId: e.target.value,
                          };
                        });
                        if (e.target.value.length === 0) {
                          setNotificationSettings((prev) => {
                            return {
                              ...prev,
                              useWhatsapp: false,
                            };
                          });
                        }
                      }}
                    />
                  </Grid2>
                  <Grid2 item size={4}>
                    <Switch
                      checked={notificationSettings?.useWhatsapp}
                      disabled={!notificationSettings?.whatsappId}
                      onChange={(e) => {
                        setNotificationSettings((prev) => {
                          return {
                            ...prev,
                            useWhatsapp: e.target.checked,
                          };
                        });
                      }}
                    />
                  </Grid2>
                </Grid2>
              </ListItem>
            </List>
          </CardContent>
          <CardActionArea>
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateShop()}
              // disabled={!action}
            >
              Save
            </Button>
          </CardActionArea>
        </Card>
        <Divider />
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
