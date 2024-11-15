import { Helmet } from 'react-helmet';
import {
  Box,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { getCurrentShopUid, getProfile } from '../session';
import './home.css';
import { useEffect, useState } from 'react';
import shopApi from '../shopApi';

const HomePage = () => {
  // const user = currentUser();

  const [customers, setCustommers] = useState([]);
  const [orders, setOrders] = useState([]);

  const currentShopUid = getCurrentShopUid();
  const userProfile = getProfile();

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await shopApi.getCustomers(currentShopUid);
      setCustommers(data);
    };
    fetchCustomers();

    const fetchOrders = async () => {
      const data = await shopApi.getOrders(currentShopUid);
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="This is a home page" />
      </Helmet>
      <Container
        maxWidth="sm"
        style={{
          textAlign: 'center',
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          style={{
            flex: 1,
          }}
        >
          <Typography variant="h6">Welcome {userProfile?.username}</Typography>
          <Typography variant="h6">Current Shop : {currentShopUid}</Typography>
        </Box>
        <Card
          variant="outlined"
          style={{ flex: 1, marginTop: '20px', width: '100%' }}
        >
          <CardContent>
            <List>
              <ListItem>Total Customers: {customers.length}</ListItem>
              <ListItem>Total Orders: {orders.length}</ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default HomePage;
