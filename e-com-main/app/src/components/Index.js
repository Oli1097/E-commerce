import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Admin from "./Admin";
import BankDetails from "./BankDetails";
import Customer from "./Customer";
import Supplier from "./Supplier";
import axios from "../axios";
import { setProducts } from "../services/slices/products";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/products")
      .then((res) => {
        dispatch(setProducts(res.data));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) return <CircularProgress />;

  if (user.role === "customer") {
    if (user.bank_ac === null || user.bank_secret === null) {
      return <BankDetails />;
    }
    return <Customer />;
  }
  if (user.role === "supplier") {
    return <Supplier />;
  }
  return <Admin />;
}
