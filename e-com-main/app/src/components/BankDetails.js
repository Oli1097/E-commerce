import Cookies from "js-cookie";
import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import {
  Alert,
  Button,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";

import axios from "../axios";
import parseError from "../helpers/parseError";
import { setUser } from "../services/slices/auth";

function BankDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    bank_ac: "",
    bank_secret: "",
  });

  const dispatch = useDispatch();

  function handleChanges(e) {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  }

  function handleAdd() {
    setLoading(true);
    axios
      .post("auth/bank", bankDetails)
      .then((res) => {
        Cookies.set("token", res.data.token);
        dispatch(setUser(res.data));
        setLoading(false);
      })
      .catch((err) => {
        setError(parseError(err));
        setLoading(false);
      });
  }

  return (
    <Stack
      component={Paper}
      p={2}
      spacing={2}
      sx={{ width: "100%", maxWidth: "400px" }}
    >
      <Typography variant="h5" align="center" fontWeight="bold" color="primary">
        Add Bank Details
      </Typography>
      <TextField
        fullWidth
        label="Bank AC Number"
        variant="outlined"
        type="number"
        name="bank_ac"
        onChange={handleChanges}
        required
      />
      <TextField
        fullWidth
        label="Bank Secret"
        variant="outlined"
        name="bank_secret"
        onChange={handleChanges}
        required
      />
      {loading && <LinearProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        variant="contained"
        startIcon={<Add />}
        disabled={loading}
        onClick={handleAdd}
        sx={{ alignSelf: "center" }}
      >
        Add
      </Button>
    </Stack>
  );
}

export default BankDetails;
