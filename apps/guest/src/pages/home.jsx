import { Helmet } from "react-helmet";
import { Container, Link, List, ListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import guestApi from "../api/guestApi";
import { basePath } from "../config";
import { FormattedMessage } from "react-intl";

const HomePage = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      if (shops.length > 0) {
        return;
      }
      const data = await guestApi.getAllShops();
      setShops(data);
    };
    fetchShops();
  }, [shops]);

  return (
    <>
      <Helmet>
        <title>Homepage</title>
      </Helmet>
      <Container
        sx={{
          padding: "1em",
        }}
      >
        <Typography variant="h4">
          <FormattedMessage id="greeting" values={{ name: "" }} />
        </Typography>
        <List>
          {shops.map((shop, index) => {
            return (
              <ListItem key={index}>
                <Link href={`${basePath}/${shop.shopUid}`}>{shop.shopUid}</Link>
              </ListItem>
            );
          })}
        </List>
      </Container>
    </>
  );
};

export default HomePage;
