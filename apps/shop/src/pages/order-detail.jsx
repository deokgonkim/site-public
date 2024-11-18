import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
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
import shopApi, { NEXT_ACTION_MAP } from '../shopApi';
import { getCurrentShopUid, setCurrentShopUid } from '../session';

const OrderDisplayKeys = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
  {
    key: 'createdAt',
    label: 'Created At',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'total',
    label: 'Total',
  },
  {
    key: 'customer',
    label: 'Customer',
    renderer: (customer) => {
      return customer && `${customer?.name} ${customer?.phone}`;
    },
  },
  {
    key: 'items',
    label: 'Items',
    renderer: (items) => {
      return (
        items &&
        items
          .map((item) => {
            return `${item.name} x ${item.quantity}`;
          })
          .join(', ')
      );
    },
  },
];

export const OrderDetailPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const { shopUid, orderId } = useParams();
  const [order, setOrder] = useState({});
  const [action, setAction] = useState('');

  const processOrder = async (action) => {
    await shopApi.processOrder(shopUid, orderId, action).then((response) => {
      console.log('updatedOrder', response.order);
      setOrder(response.order);
      setAction(NEXT_ACTION_MAP[response.order.status]);
      enqueueSnackbar('Order processed successfully', { variant: 'success' });
    });
  };

  const deleteOrder = () => {
    shopApi.deleteOrder(shopUid, orderId).then((response) => {
      console.log('deleteOrder', response);
      enqueueSnackbar('Order deleted', { variant: 'success' });
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

  const printOrder = () => {
    shopApi.printOrder(shopUid, orderId).then((response) => {
      console.log('printOrder', response);
      enqueueSnackbar('Order printed requested', { variant: 'success' });
    });
  };

  const requestPayment = () => {
    const amount = prompt('Enter amount to request payment');
    if (window.confirm(`Request payment of ${amount}?`)) {
      shopApi.requestPayment(shopUid, orderId, { amount }).then((response) => {
        console.log('requestPayment', response);
        setOrder(response.order);
        enqueueSnackbar('Payment requested', { variant: 'success' });
      });
    }
  };

  const cancelPayment = (paymentId) => {
    shopApi.cancelPayment(shopUid, orderId, paymentId).then((response) => {
      console.log('cancelPayment', response);
      setOrder(response.order);
      enqueueSnackbar('Payment canceled', { variant: 'success' });
    });
  };

  const deletePayment = (paymentId) => {
    shopApi.deletePayment(shopUid, orderId, paymentId).then((response) => {
      console.log('deletePayment', response);
      setOrder(response.order);
      enqueueSnackbar('Payment deleted', { variant: 'success' });
    });
  };

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await shopApi.getOrder(shopUid, orderId);
      setOrder(data);
      //   console.log(data);
      setAction(NEXT_ACTION_MAP[data.status]);
    };
    fetchOrder();
    if (getCurrentShopUid() !== shopUid) {
      setCurrentShopUid(shopUid);
      enqueueSnackbar(`Switched to shop ${shopUid}`, {
        variant: 'info',
      });
    }
  }, [shopUid, orderId]);

  return (
    <>
      <Helmet>
        <title>Order Detail</title>
      </Helmet>
      <Container>
        <Typography variant="h4" gutterBottom>
          Order Detail
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Box>
            <Grid2
              container
              sx={{
                display: 'flex',
                // rowGap: { xs: '0.5em' },
              }}
            >
              <Grid2 item sx={{ padding: '0.5em' }} size={{ xs: 12, sm: 6 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: '100%' }}
                  onClick={() => processOrder(action)}
                  disabled={!action}
                >
                  {action ? action + ' Order' : 'NO ACTION AVAILABLE'}
                </Button>
              </Grid2>
              <Grid2 item sx={{ padding: '0.5em' }} size={{ xs: 12, sm: 6 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: '100%' }}
                  onClick={() => processOrder('cancel')}
                >
                  Cancel Order
                </Button>
              </Grid2>
              <Grid2 item sx={{ padding: '0.5em' }} size={{ xs: 12, sm: 6 }}>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ width: '100%' }}
                  onClick={() => deleteOrder()}
                >
                  Delete Order
                </Button>
              </Grid2>
              <Grid2 item sx={{ padding: '0.5em' }} size={{ xs: 12, sm: 6 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: '100%' }}
                  onClick={() => printOrder()}
                >
                  Print Order
                </Button>
              </Grid2>
              <Grid2 item sx={{ padding: '0.5em' }} size={{ xs: 12, sm: 6 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: '100%' }}
                  onClick={() => requestPayment()}
                >
                  Request Payment
                </Button>
              </Grid2>
            </Grid2>
          </Box>
        </Paper>
        <TableContainer component={Paper} sx={{ marginTop: '1em' }}>
          <Table>
            <TableBody>
              {order &&
                OrderDisplayKeys.map(({ key, label, renderer }, i) => (
                  <TableRow key={i}>
                    <TableCell>{label}</TableCell>
                    <TableCell>
                      {renderer ? renderer(order[key]) : order[key]?.toString()}
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
        <TableContainer component={Paper} sx={{ marginTop: '1em' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PaymentId</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>TossKey</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.payments &&
                order.payments.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.paymentId}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.tossPaymentKey}</TableCell>
                    <TableCell>
                      <Button
                        disabled={!item.tossPaymentKey}
                        onClick={() => cancelPayment(item.paymentId)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => deletePayment(item.paymentId)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};
