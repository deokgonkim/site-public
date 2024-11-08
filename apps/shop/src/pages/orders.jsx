import { Container, Divider, List, ListItem, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import shopApi from '../shopApi';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await shopApi.getOrders('1234');
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
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
  );
};
