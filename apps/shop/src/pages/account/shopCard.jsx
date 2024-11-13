import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getCurrentShopUid, setCurrentShopUid } from '../../session';
import shopApi from '../../shopApi';
import { enqueueSnackbar } from 'notistack';

const ShopEditCard = (props) => {
  const [shopName, setShopName] = useState('');
  const [shopUid, setShopUid] = useState(getCurrentShopUid());

  const updateShop = () => {
    shopApi
      .updateShop(getCurrentShopUid(), {
        shopName,
        shopUid,
      })
      .then((newShop) => {
        setCurrentShopUid(newShop.shopUid);
        enqueueSnackbar('Shop updated', { variant: 'success' });
      });
  };

  useEffect(() => {
    const fetchShop = async () => {
      const data = await shopApi.getShop(getCurrentShopUid());
      setShopName(data.shopName);
      setShopUid(data.shopUid);
    };
    fetchShop();
  }, []);

  return (
    <Card {...props}>
      <CardHeader title="Shop" />
      <CardContent>
        <List>
          <ListItem>
            <TextField
              label={'Shop Name'}
              size="small"
              variant="outlined"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              label={'Shop URL'}
              size="small"
              variant="outlined"
              value={shopUid}
              onChange={(e) => setShopUid(e.target.value)}
            />
          </ListItem>
        </List>
      </CardContent>
      <CardActions>
        <Button onClick={updateShop}>Update</Button>
      </CardActions>
    </Card>
  );
};

export default ShopEditCard;
