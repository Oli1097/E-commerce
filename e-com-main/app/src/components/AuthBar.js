import Cookies from "js-cookie";
import React, { useState } from "react";
import {
  AccountBalanceWallet,
  AccountCircle,
  ExitToApp,
  Home,
  Person,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Carts from "./Carts";
import Orders from "./Orders";
import { logout } from "../services/slices/auth";

export default function AuthBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function handleLogOut() {
    Cookies.remove("token");
    dispatch(logout());
    window.location.reload();
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const isMenuOpen = Boolean(anchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem sx={{ maxWidth: "200px" }}>
        <Person sx={{ mr: 1, color: "#555555" }} />
        {user.name}
      </MenuItem>
      <MenuItem>
        <AccountBalanceWallet sx={{ mr: 1, color: "#555555" }} />
        <Typography>
          Balance: <strong>{user.bank_balance} BDT</strong>
        </Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogOut}>
        <ExitToApp fontSize="small" color="error" sx={{ mr: 1 }} />
        <Typography color="error">Log Out</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1,height:"72px" }}>
      <AppBar position="absolute">
        <Toolbar>
          <Home />
          <Typography
            variant="h6"
            noWrap
            component="div"
            fontWeight="bold"
            ml={1}
          >
            E-COM
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            {user.role === "customer" && (
              <>
                <Orders />
                <Carts />
              </>
            )}
            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
