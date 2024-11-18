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
          />
          <CardContent>
            <Box>
              {order?.items?.map((item, index) => (
                <>
                  <Grid2 container key={index}>
                    <Grid2 item size={8} sx={{ textAlign: "center" }}>
                      <Typography>
                        {item.name} x {item.quantity}
                      </Typography>
                    </Grid2>
                    <Grid2 item size={4} sx={{ textAlign: "center" }}>
                      <Typography>
                        {item.subtotal.toLocaleString()} 원
                      </Typography>
                    </Grid2>
                  </Grid2>
                </>
              ))}
            </Box>
          </CardContent>
          <CardActionArea>
            <Grid2 container alignContent={"center"} sx={{ padding: "1em" }}>
              <Grid2 item alignContent={"center"} size={8}>
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
                />
              </Grid2>
              <Grid2
                item
                alignContent={"center"}
                sx={{ padding: "0.5em", textAlign: "center" }}
                size={4}
              >
                <Button variant="contained" onClick={onClickPayment}>
                  <FormattedMessage id="payment.request.button" />
                </Button>
              </Grid2>
            </Grid2>
          </CardActionArea>
        </Card>
        <Divider />
      </Container>
    </>
  );
};
