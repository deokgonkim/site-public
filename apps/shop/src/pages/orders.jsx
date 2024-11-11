import { Container, Divider, List, ListItem, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import shopApi from '../shopApi';
import { getCurrentShopUid } from '../session';
import { Helmet } from 'react-helmet';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

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
      <Container>
        <Typography variant="h5">Orders</Typography>
        <Divider />
        <List>
          {orders.map((order, index) => {
            return (
              <ListItem key={index}>
                <Typography>Order ID: {order?.orderId}</Typography>
              </ListItem>
            );
          })}
        </List>
      </Container>
    </>
  );
};
