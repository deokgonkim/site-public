import { Helmet } from 'react-helmet';
import {
  Box,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from '@mui/material';
import { getCurrentShopUid, getProfile } from '../session';
import './home.css';
import { useEffect, useState } from 'react';
import shopApi from '../shopApi';
import { Chat } from '@mui/icons-material';
import { ChatDialog } from './home/ChatDialog';

const HomePage = () => {
  // const user = currentUser();

  const [customers, setCustommers] = useState([]);
  const [orders, setOrders] = useState([]);

  const currentShopUid = getCurrentShopUid();
  const userProfile = getProfile();

  const [open, setOpen] = useState(false);
  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
        <ChatDialog
          open={open}
          handleClose={handleClose}
          // handleSend={handleSend}
        />
        <SpeedDial
          ariaLabel="SpeedDial"
          icon={<SpeedDialIcon />}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <SpeedDialAction
            key={'chat'}
            icon={<Chat />}
            tooltipTitle="Ask AI"
            onClick={handleOpenDialog}
          />
        </SpeedDial>
      </Container>
    </>
  );
};

export default HomePage;
