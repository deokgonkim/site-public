import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import {
  Button,
  Container,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
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
  const [countryCode, setCountryCode] = useState("+82");
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
          <Select
            labelId="country-code-label"
            id="country-code"
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setCustomerPhone("");
            }}
            label="Country Code"
          >
            <MenuItem value="+82">🇰🇷 +82 (South Korea)</MenuItem>
            <MenuItem value="+1">🇺🇸 +1 (USA)</MenuItem>
            <MenuItem value="+44">🇬🇧 +44 (UK)</MenuItem>
            <MenuItem value="+49">🇩🇪 +49 (Germany)</MenuItem>
            {/* Add more countries as needed */}
          </Select>
          {/* 뭔가 마음에 안드는 전화번호 핸들링이다. */}
          {/* iOS Safari에서 countryCode가 포함된 번호 Auto fill 할 때, */}
          {/* 국가코드가 날라가서, 국가코드 컬럼이 들어가고, 값에 대한 조작이 발생하고 있다. */}
          <TextField
            label={intl.formatMessage({ id: "field.phone" })}
            autoComplete="mobile tel"
            type="tel"
            value={
              customerPhone.startsWith(countryCode)
                ? customerPhone.slice(countryCode.length)
                : customerPhone
            }
            onChange={(e) => {
              if (
                e.target.value.startsWith("+") &&
                !e.target.value.startsWith(countryCode)
              ) {
                setCustomerPhone("");
                return;
              }
              setCustomerPhone(
                e.target.value.startsWith(countryCode)
                  ? e.target.value
                  : countryCode + e.target.value
              );
            }}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{countryCode}</InputAdornment>
              ),
            }}
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
