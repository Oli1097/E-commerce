import React from "react";
import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import prod1 from "../assets/prod1.jpg";
import axios from "../axios";
import { addToCart } from "../services/slices/cart";
const productImages = [prod1, prod1, prod1];

export default function Customer() {
  const products = useSelector((state) => state.products);

  const dispatch = useDispatch();

  function handleAddToCart(id) {
    dispatch(addToCart(id));
    axios.post("/carts", { product_id: id, quantity: 1 });
  }
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      {products.map((product, idx) => (
        <Stack
          key={product.id}
          component={Paper}
          p={1}
          spacing={1}
          sx={{
            "& img": {
              width: "250px",
              height: "200px",
              objectFit: "cover",
            },
          }}
        >
          <img src={productImages[idx]} />
          <Typography variant="h6" px={1}>
            {product.name}
          </Typography>
          <Divider />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" fontWeight="bold">
              ৳ {product.price}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ShoppingCart />}
              onClick={() => handleAddToCart(product.id)}
            >
              Add to cart
            </Button>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
