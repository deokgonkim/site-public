import {
  Container,
  Divider,
  Grid2,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import shopApi from '../shopApi';
import { getCurrentShopUid } from '../session';
import { Helmet } from 'react-helmet';
import { basePath } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { toHumanReadable } from '../util/date';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [shopUid, setShopUid] = useState(getCurrentShopUid());

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await shopApi.getOrders(getCurrentShopUid());
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Orders Page</title>
        <meta name="description" content="This is a orders page" />
      </Helmet>
      <Container sx={{ paddingTop: '0.5em' }}>
        <Typography variant="h5">Orders</Typography>
        <Divider />
        <List>
          {orders.map((order, index) => {
            return (
              <ListItem key={index} style={{ padding: 0 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(`/orders/${shopUid}/${order?.orderId}`);
                  }}
                >
                  <Grid2 container spacing={2} style={{ width: '100%' }}>
                    <Grid2 item size={4} sx={{ textAlign: 'center' }}>
                      {order?.customer?.name}
                    </Grid2>
                    <Grid2 item size={4} sx={{ textAlign: 'center' }}>
                      {order?.status}
                    </Grid2>
                    <Grid2 item size={4} sx={{ textAlign: 'center' }}>
                      {toHumanReadable(order?.createdAt)}
                    </Grid2>
                  </Grid2>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Container>
    </>
  );
};
