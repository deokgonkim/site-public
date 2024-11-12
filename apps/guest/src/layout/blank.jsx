import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import shopApi from "../api/guestApi";
import { Header } from "../api/session";
import { FormattedMessage, useIntl } from "react-intl";

const BlankLayout = () => {
  const intl = useIntl();
  const [shopName, setShopName] = useState("");

  // get :shopUid paramter from
  const { shopUid } = useParams();
  const [breadcrums, setBreadcrums] = useState([]);

  useEffect(() => {
    const fetchShopName = async () => {
      if (shopUid) {
        const data = await shopApi.getShop(shopUid);
        setShopName(data.shopUid);
      } else {
        setShopName("");
      }
    };
    fetchShopName();
  }, [shopUid, shopName]);
  useEffect(() => {
    setBreadcrums(Header());
  }, [window.location.pathname]);

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
          {breadcrums.map((e, i) => {
            return (
              <>
                <Typography key={i} variant="h6">
                  &nbsp;
                  <Link to={e.link}>
                    <FormattedMessage id={e.label} />
                  </Link>
                  &nbsp;
                </Typography>
                {i != breadcrums.length - 1 && (
                  <Typography variant="h6"> &gt; </Typography>
                )}
              </>
            );
          })}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Container>
  );
};

export default BlankLayout;
