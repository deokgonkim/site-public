import { Helmet } from "react-helmet";
import { Container, Link, List, ListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import guestApi from "../api/guestApi";
import { basePath } from "../config";

const HomePage = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
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
      <Container>
        <Typography variant="h4">Hello World</Typography>
        <List>
          {shops.map((shop, index) => {
            return (
              <ListItem key={index}>
                <Link href={`${basePath}/${shop.shopUid}`} target={"self"}>
                  {shop.shopUid}
                </Link>
              </ListItem>
            );
          })}
        </List>
      </Container>
    </>
  );
};

export default HomePage;
