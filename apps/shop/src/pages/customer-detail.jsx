import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
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
import { LinearProgress } from '@mui/material';
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
          <Box style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteCustomer()}
            >
              Delete Customer
            </Button>
          </Box>
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
