import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => processOrder(action)}
              disabled={!action}
            >
              Process Order{action && `(action=${action})`}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => processOrder('cancel')}
            >
              Cancel Order
            </Button>
          </div>
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
      </Container>
    </>
  );
};
