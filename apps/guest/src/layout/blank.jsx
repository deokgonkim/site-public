import {
  AppBar,
  Breadcrumbs,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { styled } from "@mui/material/styles";
import shopApi from "../api/guestApi";
import { Header } from "../api/session";
import { FormattedMessage, useIntl } from "react-intl";

const BlankLayout = () => {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = useState(null);
  const [shopName, setShopName] = useState("");

  const [collapsedItems, setCollapsedItems] = useState([]);

  // get :shopUid paramter from
  const { shopUid } = useParams();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const handleClick = (event) => {
    if (event) {
      setAnchorEl(event.currentTarget);
    }
  };

  const onClick = (e) => {
    return () => {};
  };

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
    const headers = Header();
    console.log("headers", headers);
    if (headers.length > 2) {
      setCollapsedItems(headers.slice(1, headers.length - 1));
      setBreadcrumbs(headers.slice(headers.length - 1));
    } else {
      setBreadcrumbs(headers);
    }
    console.log("collapsedItems", collapsedItems);
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
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {collapsedItems.map((e, i) => (
              <MenuItem onClick={onClick(e)}>
                <Link to={e.link}>
                  <FormattedMessage id={e.label} />
                </Link>
              </MenuItem>
            ))}
          </Menu>
          <Breadcrumbs separator=">">
            <StyledLink to="/">
              <FormattedMessage id="breadcrumb.home" />
            </StyledLink>
            {collapsedItems.length > 0 && (
              <IconButton color="gray" onClick={handleClick}>
                <MoreHorizIcon />
              </IconButton>
            )}
            {breadcrumbs.map((e, i) => (
              <StyledLink to={e.link}>
                <FormattedMessage id={e.label} />
              </StyledLink>
            ))}
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Container>
  );
};

const StyledLink = styled(Link)({
  color: "white",
  textDecoration: "none",
});

export { StyledLink };

export default BlankLayout;
