import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import { TextField, Box } from "@mui/material";
import { useState } from "react";

import guestApi from "../api/guestApi";
import { basePath } from "../config";
import { setLastOrder } from "../api/session";

const HomePage = () => {
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
        window.alert("Order placed successfully");
        setLastOrder(response);
        window.location.href = `${basePath}/${shopUid}/final`;
      });
  };

  return (
    <>
      <Helmet>
        <title>Homepage</title>
      </Helmet>
      <Container>
        <Typography variant="h4">Hello World</Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <TextField
            label="Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
          <TextField
            label="Order Item"
            value={orderItem}
            onChange={(e) => setOrderItem(e.target.value)}
            required
          />
        </Box>
        <Button onClick={placeOrder}>Place Order</Button>
      </Container>
    </>
  );
};

export default HomePage;
