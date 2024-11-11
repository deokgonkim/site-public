import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import { List, ListItem, Link } from "@mui/material";
import { getLastOrder } from "../api/session";

const TELEGRAM_BOT =
  process.env.REACT_APP_TELEGRAM_BOT_NAME || "no-bot-is-configured";
const WHATSAPP_ID =
  process.env.REACT_APP_WHATSAPP_ID || "no-chat-is-configured";

const FinalPage = () => {
  //   const { shopUid } = useParams();
  const lastOrder = getLastOrder();

  const [telegramLink, setTelegramLink] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  useState(() => {
    if (lastOrder) {
      const telegramStart = btoa(
        `${lastOrder.customerId},${lastOrder.orderId}`
      );
      setTelegramLink(`https://t.me/${TELEGRAM_BOT}?start=${telegramStart}`);
      setWhatsappLink(
        `https://wa.me/${WHATSAPP_ID}?text=${encodeURIComponent(
          "My Order is " + lastOrder.customerId + "," + lastOrder.orderId
        )}`
      );
    }
  }, [lastOrder]);

  return (
    <>
      <Helmet>
        <title>Final</title>
      </Helmet>
      <Container>
        <Typography variant="h4">Notify me</Typography>
        <Typography variant="h6">
          예약에 대한 알림 사항을 아래 채널을 통해 받으실 수 있습니다.
        </Typography>
        <List>
          <ListItem>
            <Link href={telegramLink} target="_blank" rel="noopener">
              Telegram으로 받기
            </Link>
          </ListItem>
          <ListItem>
            <Link href={whatsappLink} target="_blank" rel="noopener">
              WhatsApp으로 받기
            </Link>
          </ListItem>
        </List>
      </Container>
    </>
  );
};

export default FinalPage;
