import React, { useEffect, useState } from "react";
import { Dialog, IconButton, Paper, Stack, Typography } from "@mui/material";
import { History } from "@mui/icons-material";
import { useSelector } from "react-redux";

import axios from "../axios";

const statusMap = [
  { color: "textSecondary", label: "Pending" },
  { color: "primary", label: "Verified" },
  { color: "green", label: "Delivered" },
  { color: "error", label: "Cancelled" },
];

export default function Orders() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const products = useSelector((state) => state.products);

  useEffect(() => {
    axios.get("carts/orders").then((res) => {
      setOrders(res.data);
    });
    return () => {
      setOrders([]);
    };
  }, [orderOpen]);

  useEffect(() => {
    const newSelected = orders.map((item) => {
      const product = products.find((product) => item.product_id === product.id); 
      return {
        ...product,
        ...item
      };
    }); 
    setSelectedProducts(newSelected);
  }, [orders, products]);

  function handleOpenOrder() {
    setOrderOpen(true);
  }

  function handleCloseOrder() {
    setOrderOpen(false);
  }

  return (
    <>
      <IconButton size="large" color="inherit" onClick={handleOpenOrder}>
        <History />
      </IconButton>
      <Dialog open={orderOpen} onClose={handleCloseOrder} fullWidth>
        <Stack p={2} spacing={2}>
          {selectedProducts.map((item) => (
            <Stack key={item.id} component={Paper} p={1} spacing={1}>
              <Typography variant="h6">{item.name}</Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <Typography fontWeight="bold">
                  Quantity: {item.quantity}
                </Typography>
                <Typography fontWeight="bold">
                  Price: {item.price * item.quantity}
                </Typography>
                <Typography fontWeight="bold">
                  Status:{" "}
                  <Typography
                    fontWeight="bold"
                    component="span"
                    color={statusMap[item.status].color}
                  >
                    {statusMap[item.status].label}
                  </Typography>
                </Typography>
              </Stack>
            </Stack>
          ))}
          {selectedProducts.length === 0 && (
            <Typography
              textAlign="center"
              color="textSecondary"
              py={2}
              className="null"
            >
              No orders found!
            </Typography>
          )}
        </Stack>
      </Dialog>
    </>
  );
}
