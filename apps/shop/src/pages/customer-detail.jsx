import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { LinearProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import shopApi, { NEXT_ACTION_MAP } from '../shopApi';
import { getCurrentShopUid, setCurrentShopUid } from '../session';

const CustomerDisplayKeys = [
  {
    key: 'customerId',
    label: 'Customer ID',
  },
  {
    key: 'createdAt',
    label: 'Created At',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'phone',
    label: 'Phone',
  },
];

export const CustomerDetailPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const { shopUid, customerId } = useParams();
  const [customer, setCustomer] = useState({});
  const [action, setAction] = useState('');

  const deleteCustomer = () => {
    shopApi.deleteCustomer(shopUid, customerId).then((response) => {
      console.log('deleteCustomer', response);
      enqueueSnackbar('Customer deleted', { variant: 'success' });
    });
    const interval = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 0.5);
    }, 10);

    const duration = setTimeout(() => {
      clearInterval(interval);
      setProgress(0);
      navigate(-1);
    }, 1000);
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      const data = await shopApi.getCustomer(shopUid, customerId);
      setCustomer(data);
      //   console.log(data);
      setAction(NEXT_ACTION_MAP[data.status]);
    };
    fetchCustomer();
    if (getCurrentShopUid() !== shopUid) {
      setCurrentShopUid(shopUid);
      enqueueSnackbar(`Switched to shop ${shopUid}`, {
        variant: 'info',
      });
    }
  }, [shopUid, customerId]);

  return (
    <>
      <Helmet>
        <title>Customer Detail</title>
      </Helmet>
      <Container>
        <Typography variant="h4" gutterBottom>
          Customer Detail
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Grid2 container>
            {customer.telegramLink && (
              <Grid2
                item
                alignContent={'center'}
                size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
              >
                <Box
                  sx={{
                    margin: { xs: '0.5em' },
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    component={Link}
                    to={`${customer.telegramLink}`}
                    style={{ width: '100%' }}
                    target="_blank"
                  >
                    Telegram&nbsp;
                    <FontAwesomeIcon
                      size="2x"
                      icon={faTelegram}
                      style={{ marginRight: '0.5em' }}
                    />
                  </Button>
                </Box>
              </Grid2>
            )}
            {customer.whatsappLink && (
              <Grid2
                item
                alignContent={'center'}
                size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
              >
                <Box
                  sx={{
                    margin: { xs: '0.5em' },
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    component={Link}
                    to={`${customer.whatsappLink}`}
                    style={{ width: '100%' }}
                    target="_blank"
                  >
                    WhatsApp&nbsp;
                    <FontAwesomeIcon
                      size="2x"
                      icon={faWhatsapp}
                      style={{ marginRight: '0.5em' }}
                    />
                  </Button>
                </Box>
              </Grid2>
            )}

            <Grid2
              item
              alignContent={'center'}
              size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
            >
              <Box
                sx={{
                  margin: { xs: '0.5em' },
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  component={Link}
                  style={{ width: '100%' }}
                  to={`tel:${customer.phone}`}
                >
                  Call {customer.phone}
                </Button>
              </Box>
            </Grid2>
            <Grid2
              item
              alignContent={'center'}
              size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
            >
              <Box
                sx={{
                  margin: { xs: '0.5em' },
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  component={Link}
                  style={{ width: '100%' }}
                  to={`sms:${customer.phone}?body=Hello`}
                >
                  Send SMS
                </Button>
              </Box>
            </Grid2>
            <Grid2
              item
              sx={{ alignContent: 'center' }}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Box
                sx={{
                  margin: { xs: '0.5em' },
                  display: 'flex',

                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  style={{ width: '100%' }}
                  onClick={() => deleteCustomer()}
                >
                  Delete Customer
                </Button>
              </Box>
            </Grid2>
          </Grid2>
        </Paper>
        <TableContainer component={Paper} sx={{ marginTop: '1em' }}>
          <Table>
            <TableBody>
              {customer &&
                CustomerDisplayKeys.map(({ key, label, renderer }, i) => (
                  <TableRow key={i}>
                    <TableCell>{label}</TableCell>
                    <TableCell>
                      {renderer
                        ? renderer(customer[key])
                        : customer[key]?.toString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {progress > 0 && (
          <LinearProgress
            value={progress}
            valueBuffer={progress}
            variant="determinate"
          />
        )}
      </Container>
    </>
  );
};
