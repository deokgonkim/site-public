import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import { TextField, Box } from "@mui/material";
import { useState } from "react";

import guestApi from "../api/guestApi";
import { basePath } from "../config";
import { setLastOrder } from "../api/session";
import { FormattedMessage, useIntl } from "react-intl";

const FirstPage = () => {
  const intl = useIntl();
  console.log("FirstPage");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderItem, setOrderItem] = useState("");

  const { shopUid } = useParams();

  const placeOrder = async () => {
    guestApi
      .createOrder(shopUid, {
        customer: {
          name: customerName,
          phone: customerPhone,
        },
        items: [
          {
            name: orderItem,
            price: 0,
            quantity: 1,
          },
        ],
      })
      .then((response) => {
        console.log(response);
        window.alert(
          intl.formatMessage({
            id: "first.orderPlaced",
          })
        );
        setLastOrder(response);
        window.location.href = `${basePath}/${shopUid}/final`;
      });
  };

  return (
    <>
      <Helmet>
        <title>Homepage</title>
      </Helmet>
      <Container sx={{ paddingTop: "1em" }}>
        <Typography variant="h4">
          <FormattedMessage id="first.title" />
        </Typography>
        <Box
          component="form"
          sx={{
            padding: "1em",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignContent: "center",
          }}
        >
          <TextField
            label={intl.formatMessage({ id: "field.name" })}
            value={customerName}
            autoComplete="name"
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <TextField
            label={intl.formatMessage({ id: "field.phone" })}
            autoComplete="mobile tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
          <TextField
            label={intl.formatMessage({ id: "field.orderItem" })}
            value={orderItem}
            onChange={(e) => setOrderItem(e.target.value)}
            required
          />
          <Button onClick={placeOrder}>
            <FormattedMessage id="first.placeOrder" />
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default FirstPage;
