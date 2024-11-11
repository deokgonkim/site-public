import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import shopApi from "../api/guestApi";

const BlankLayout = () => {
  const [shopName, setShopName] = useState("");

  // get :shopUid paramter from
  const { shopUid } = useParams();

  useEffect(() => {
    const fetchShopName = async () => {
      if (shopUid) {
        const data = await shopApi.getShop(shopUid);
        setShopName(data.shopId);
      }
    };
    fetchShopName();
  }, [shopUid, shopName]);

  return (
    <Container
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        padding: 0,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">{shopName}</Typography>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Container>
  );
};

export default BlankLayout;
