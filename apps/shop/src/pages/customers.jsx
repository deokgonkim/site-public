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

export const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [shopUid, setShopUid] = useState(getCurrentShopUid());

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await shopApi.getCustomers(getCurrentShopUid());
      setCustomers(data);
    };
    fetchCustomers();
  }, []);

  return (
    <>
      <Helmet>
        <title>Customers Page</title>
        <meta name="description" content="This is a orders page" />
      </Helmet>
      <Container sx={{ paddingTop: '0.5em' }}>
        <Typography variant="h5">Customers</Typography>
        <Divider />
        <List>
          {customers.map((customer, index) => {
            return (
              <ListItem key={index} style={{ padding: 0 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(`/${shopUid}/customers/${customer?.customerId}`);
                  }}
                >
                  <Grid2 container spacing={2} style={{ width: '100%' }}>
                    <Grid2
                      item
                      size={{ xs: 6, md: 4 }}
                      sx={{ textAlign: 'center' }}
                    >
                      {customer?.name}
                    </Grid2>
                    <Grid2
                      item
                      display={{ xs: 'none', md: 'block' }}
                      size={{ md: 4 }}
                      sx={{ textAlign: 'center' }}
                    >
                      {customer?.phone}
                    </Grid2>
                    <Grid2
                      item
                      size={{ xs: 6, md: 4 }}
                      sx={{ textAlign: 'center' }}
                    >
                      {toHumanReadable(customer?.createdAt)}
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
