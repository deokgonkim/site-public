import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormLabel,
  Grid2,
  List,
  ListItem,
  Switch,
  TextField,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import shopApi from '../../shopApi';
import { getCurrentShopUid } from '../../session';

export const NotificationSettingCard = (props) => {
  const [notificationSettings, setNotificationSettings] = useState({
    telegramId: '',
    useTelegram: false,
    whatsappId: '',
    useWhatsapp: false,
  });

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

      const currentShopUid = getCurrentShopUid();
      let shop;
      if (!currentShopUid) {
        shop = data?.userShops?.[0]?.shop;
      } else {
        shop = data?.userShops?.find((s) => s.shopUid === currentShopUid)?.shop;
      }
      if (shop) {
        setNotificationSettings({
          telegramId: shop.telegramId || '',
          useTelegram: shop.useTelegram,
          whatsappId: shop.whatsappId || '',
          useWhatsapp: shop.useWhatsapp,
        });
        console.log(notificationSettings);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Card {...props}>
      <CardHeader title="Notification Settings" />
      <CardContent>
        <List>
          <ListItem>
            <Grid2 container spacing={2} style={{ width: '100%' }}>
              <Grid2 size={6}>
                <TextField
                  label={'Telegram ID'}
                  size="small"
                  variant="outlined"
                  sx={{ padding: 0 }}
                  value={notificationSettings.telegramId}
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
              <Grid2 size={6}>
                <FormLabel>Use</FormLabel>
                <Switch
                  label={'Use Telegram'}
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
              <Grid2 size={6}>
                <TextField
                  label={'Whatsapp ID'}
                  size="small"
                  variant="outlined"
                  sx={{ padding: 0 }}
                  value={notificationSettings.whatsappId}
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
              <Grid2 size={6}>
                <FormLabel>Use</FormLabel>
                <Switch
                  label={'Use Whatsapp'}
                  checked={notificationSettings?.useWhatsapp}
                  disabled={!notificationSettings?.whatsappId ? true : false}
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
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShop()}
          // disabled={!action}
        >
          Save
        </Button>
      </CardActions>
    </Card>
  );
};
