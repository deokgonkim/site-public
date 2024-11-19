import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import guestApi from "../api/guestApi";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
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
  TextField,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { FormattedMessage, useIntl } from "react-intl";

export const PaymentPage = () => {
  const intl = useIntl();

  const { shopUid, orderId } = useParams();

  const [order, setOrder] = useState(null);

  const onClickPayment = () => {
    // if (!window.confirm(`${document.location.href}/callback?success=1`)) {
    //   return;
    // }
    window.tossPayments
      .requestPayment("카드", {
        amount: order.payments?.[0]?.amount,
        orderId: order.payments?.[0]?.paymentId,
        orderName: `${shopUid}주문 ${order?.items?.[0]?.name} 외`,
        successUrl: `${document.location.href}/callback?success=1`,
        failUrl: `${document.location.href}/callback?fail=1`,
      })
      .then((result) => {
        console.log("payment requested", result);
      })
      .catch((e) => {
        console.error("payment error", e);
        alert(e);
      });
  };

  useEffect(() => {
    guestApi.getOrder(shopUid, orderId).then((response) => {
      setOrder(response);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: "payment.title" })}</title>
      </Helmet>
      <Container>
        <Typography variant="h4">
          <FormattedMessage id="payment.title" />
        </Typography>
        <Card variant="outlined" style={{ width: "100%" }}>
          <CardHeader
            title={intl.formatMessage({ id: "payment.order.title" })}
            sx={{ paddingBotton: "0" }}
          />
          <CardContent sx={{ padding: "0 1em" }}>
            <Box>
              <TableContainer component={Paper} sx={{ marginTop: "1em" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <FormattedMessage id="payment.order.col1" />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <FormattedMessage id="payment.order.col2" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order?.items?.map((item, index) => (
                      <TableRow for={index}>
                        <TableCell>
                          <Typography>
                            {item.name} x {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <Typography>
                            {item.subtotal.toLocaleString()} 원
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
          <CardActions style={{ display: "flex" }}>
            <Box style={{ flex: 1 }}>
              <Typography variant="h6">
                <FormattedMessage id="payment.request.title" />
              </Typography>
              <TextField
                label={intl.formatMessage({ id: "payment.request.amount" })}
                variant="outlined"
                fullWidth
                margin="normal"
                value={order?.payments?.[0]?.amount?.toLocaleString() + " 원"}
                disabled
                slotProps={{ htmlInput: { style: { textAlign: "right" } } }}
              />
              <Button
                variant="contained"
                style={{ width: "100%" }}
                onClick={onClickPayment}
              >
                <FormattedMessage id="payment.request.button" />
              </Button>
            </Box>
          </CardActions>
        </Card>
        <Divider />
      </Container>
    </>
  );
};
