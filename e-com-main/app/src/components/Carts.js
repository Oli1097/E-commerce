import React, { useEffect, useState } from "react";
import { Add, Delete, Remove, ShoppingCart } from "@mui/icons-material";
import {
  Alert,
  Badge,
  Button,
  Dialog,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import axios from "../axios";
import parseError from "../helpers/parseError";
import {
  addToCart,
  deleteFromCart,
  removeFromCart,
  setCart,
} from "../services/slices/cart";
import { setBalance } from "../services/slices/auth";

export default function Carts() {
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const products = useSelector((state) => state.products);
  const user = useSelector((state) => state.auth.user);
  const total = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (!cartOpen) {
      setError("");
      setOrdered(false);
    }
  }, [cartOpen]);

  useEffect(() => {
    const ids = cart.map((item) => item.id);
    const selected = products.filter((item) => ids.includes(item.id));
    const newSelected = selected.map((item) => {
      const cartItem = cart.find((cart) => cart.id === item.id);
      return { ...item, quantity: cartItem.quantity };
    });
    setSelectedProducts(newSelected);
  }, [cart, products]);

  useEffect(() => {
    axios.get("carts").then((res) => {
      dispatch(setCart(res.data));
    });
  }, [dispatch]);

  function handleOpenCart() {
    if (cart.length === 0) return;
    setCartOpen(true);
  }

  function handleCloseCart() {
    setCartOpen(false);
  }

  function handleAddToCart(id) {
    dispatch(addToCart(id));
    axios.post("/carts", { product_id: id, quantity: 1 });
  }

  function handleRemoveFromCart(id) {
    dispatch(removeFromCart(id));
    axios.post("/carts", { product_id: id, quantity: -1 });
  }

  function handleDeleteCart(id) {
    dispatch(deleteFromCart(id));
    axios.delete(`/carts/${id}`);
  }

  const totalPrice = selectedProducts.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  function handleOrder() {
    setError("");
    if (totalPrice > user.bank_balance) {
      setError("Insufficient balance. Current balance: " + user.bank_balance);
      return;
    }
    axios
      .post("carts/orders")
      .then(() => {
        dispatch(setBalance(user.bank_balance - totalPrice));
        dispatch(setCart([]));
        setSelectedProducts([]);
        setOrdered(true);
      })
      .catch((err) => {
        setError(parseError(err));
      });
  }

  return (
    <>
      <IconButton size="large" color="inherit" onClick={handleOpenCart}>
        <Badge badgeContent={total} color="error">
          <ShoppingCart />
        </Badge>
      </IconButton>
      <Dialog open={cartOpen} onClose={handleCloseCart} fullWidth>
        {ordered ? (
          <Stack p={2} spacing={2}>
            <Alert severity="success">Order placed successfully!</Alert>
          </Stack>
        ) : (
          <Stack p={2} spacing={2}>
            {selectedProducts.map((item) => (
              <Stack
                key={item.id}
                component={Paper}
                p={1}
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Stack spacing={1} flex={1}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    width="100%"
                    alignItems="center"
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={item.quantity === 1}
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      width="50px"
                      textAlign="center"
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleAddToCart(item.id)}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                    <Stack flexGrow={1} />
                    <Typography ml="auto" fontWeight="bold">
                      Price: {item.price * item.quantity}
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteCart(item.id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            ))}
            {error && <Alert severity="error">{error}</Alert>}
            <Divider />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold" color="primary" variant="h5">
                Total: {totalPrice}
              </Typography>
              <Button variant="contained" onClick={handleOrder}>
                Order
              </Button>
            </Stack>
          </Stack>
        )}
      </Dialog>
    </>
  );
}
