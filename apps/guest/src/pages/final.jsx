import { useState } from "react";
import { Helmet } from "react-helmet";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import { List, ListItem, Link } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { getLastOrder } from "../api/session";
import guestApi from "../api/guestApi";

const TELEGRAM_BOT =
  process.env.REACT_APP_TELEGRAM_BOT_NAME || "no-bot-is-configured";
const WHATSAPP_ID =
  process.env.REACT_APP_WHATSAPP_ID || "no-chat-is-configured";

const FinalPage = () => {
  //   const { shopUid } = useParams();
  const intl = useIntl();
  const lastOrder = getLastOrder();
  const [shop, setShop] = useState(null);

  const [telegramLink, setTelegramLink] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  useState(() => {
    if (lastOrder) {
      const telegramStart = btoa(
        `${lastOrder.customerId},${lastOrder.orderId}`
      );
      // setTelegramLink(`https://t.me/${TELEGRAM_BOT}?start=${telegramStart}`);
      // setWhatsappLink(
      //   `https://wa.me/${WHATSAPP_ID}?text=${encodeURIComponent(
      //     "My Order is " + lastOrder.customerId + "," + lastOrder.orderId
      //   )}`
      // );
      guestApi.getShop(lastOrder.shopUid).then((shop) => {
        setShop(shop);
        console.log("shop", shop);
        if (shop.useTelegram) {
          setTelegramLink(
            `https://t.me/${TELEGRAM_BOT}?start=${telegramStart}`
          );
        }
        if (shop.useWhatsapp) {
          setWhatsappLink(
            `https://wa.me/${WHATSAPP_ID}?text=${encodeURIComponent(
              "My Order is " + lastOrder.customerId + "," + lastOrder.orderId
            )}`
          );
        }
      });
    }
  }, [lastOrder]);

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: "final.title" })}</title>
      </Helmet>
      <Container
        sx={{
          padding: "1em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">
          <FormattedMessage id="final.title" />
        </Typography>
        <Typography variant="h6">
          <FormattedMessage id="final.guide" />
        </Typography>
        <List>
          {shop && shop.useTelegram && (
            <ListItem>
              <FontAwesomeIcon
                size="2x"
                icon={faTelegram}
                style={{ marginRight: "0.5em" }}
              />
              <Link href={telegramLink} target="_blank" rel="noopener">
                <FormattedMessage
                  id="final.enter"
                  values={{ name: "Telegram" }}
                />
              </Link>
            </ListItem>
          )}
          {shop && shop.useWhatsapp && (
            <ListItem>
              <FontAwesomeIcon
                size="2x"
                icon={faWhatsapp}
                style={{ marginRight: "0.5em" }}
              />
              <Link href={whatsappLink} target="_blank" rel="noopener">
                <FormattedMessage
                  id="final.enter"
                  values={{ name: "WhatsApp" }}
                />
              </Link>{" "}
              (Sandbox Join code answer-alive)
            </ListItem>
          )}
        </List>
      </Container>
    </>
  );
};

export default FinalPage;
