import { useEffect } from "react";
import { useParams } from "react-router-dom";
import guestApi from "../api/guestApi";
import { CircularProgress, Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { FormattedMessage, useIntl } from "react-intl";
import { basePath } from "../config";

export const PaymentCallbackPage = () => {
  const intl = useIntl();

  const query = new URLSearchParams(window.location.search);
  const success = query.get("success");
  const fail = query.get("fail");
  const paymentId = query.get("orderId");
  const paymentKey = query.get("paymentKey");
  const amount = query.get("amount");

  const { shopUid, orderId } = useParams();

  useEffect(() => {
    // display circularprogress while waiting for the response
    // guestApi.getOrder(shopUid, orderId).then((response) => {
    //   setOrder(response);
    // });
    if (success) {
      guestApi
        .processPayment(shopUid, orderId, {
          paymentId,
          paymentKey,
          amount,
        })
        .then((response) => {
          console.log(response);
          window.alert(
            intl.formatMessage({
              id: "payment-callback.paymentProcessed",
            })
          );
          window.location.href = `${document.location.origin}${basePath}/${shopUid}/final`;
        });
    } else {
      window.alert(
        intl.formatMessage({
          id: "payment-callback.paymentFailed",
        })
      );
      window.location.href = `${document.location.origin}${basePath}/${shopUid}/final`;
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: "payment-callback.title" })}</title>
      </Helmet>
      <Container>
        <Typography variant="h4">
          <FormattedMessage id="payment-callback.title" />
        </Typography>
        <CircularProgress />
      </Container>
    </>
  );
};
