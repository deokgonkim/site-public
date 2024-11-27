import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

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
  const [shop, setShop] = useState(null);

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
            subtotal: 0,
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

  useEffect(() => {
    if (shopUid) {
      guestApi.getShop(shopUid).then((response) => {
        setShop(response);
      });
    }
  }, [shopUid]);

  return (
    <>
      <Helmet>
        <title>Homepage</title>
      </Helmet>
      <Container sx={{ paddingTop: "1em" }}>
        <Typography variant="h4">
          {shopUid} - {shop?.shopName}
        </Typography>
        <Card style={{ marginTop: "1em" }}>
          <CardHeader
            title={intl.formatMessage(
              {
                id: "shop.description.header",
              },
              {
                name: shop?.shopName,
              }
            )}
          />
          <CardContent>
            <Markdown>{shop?.description}</Markdown>
          </CardContent>
        </Card>
        <Card style={{ marginTop: "1em" }}>
          <CardContent>
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
              <FormControl variant="outlined">
                <InputLabel id="country-code-label">
                  {intl.formatMessage({ id: "field.countryCode" })}
                </InputLabel>
                <Select
                  label={intl.formatMessage({ id: "field.countryCode" })}
                  labelId="country-code-label"
                  id="country-code"
                  value={countryCode}
                  onChange={(e) => {
                    setCountryCode(e.target.value);
                    setCustomerPhone("");
                  }}
                >
                  <MenuItem value="+82">🇰🇷 +82 (South Korea)</MenuItem>
                  <MenuItem value="+1">🇺🇸 +1 (USA)</MenuItem>
                  <MenuItem value="+44">🇬🇧 +44 (UK)</MenuItem>
                  <MenuItem value="+49">🇩🇪 +49 (Germany)</MenuItem>
                  <MenuItem value="">
                    {intl.formatMessage({ id: "other" })}
                  </MenuItem>
                  {/* Add more countries as needed */}
                </Select>
              </FormControl>
              {/* 뭔가 마음에 안드는 전화번호 핸들링이다. */}
              {/* iOS Safari에서 countryCode가 포함된 번호 Auto fill 할 때, */}
              {/* 국가코드가 날라가서, 국가코드 컬럼이 들어가고, 값에 대한 조작이 발생하고 있다. */}
              <TextField
                label={intl.formatMessage({ id: "field.phone" })}
                name="phone"
                autoComplete="mobile tel"
                type="tel"
                value={
                  customerPhone.startsWith(countryCode)
                    ? customerPhone.slice(countryCode.length)
                    : customerPhone
                }
                onChange={(e) => {
                  if (
                    e.target.value.match(/^\+\d/) &&
                    !e.target.value.startsWith(countryCode)
                  ) {
                    setCustomerPhone("");
                    return;
                  }
                  const cleanNumber = e.target.value.startsWith("+")
                    ? "+" + e.target.value.replace(/\D/g, "")
                    : e.target.value.replace(/\D/g, "");
                  setCustomerPhone(
                    e.target.value.startsWith(countryCode)
                      ? cleanNumber
                      : countryCode + cleanNumber
                  );
                }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {countryCode}
                    </InputAdornment>
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
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default FirstPage;
