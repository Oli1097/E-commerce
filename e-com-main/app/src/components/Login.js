import Cookies from "js-cookie";
import React, { useState } from "react";
import {
  Alert,
  Button,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Login as LoginIcon, PersonAddAlt } from "@mui/icons-material";
import { useDispatch } from "react-redux";

import axios from "../axios";
import parseError from "../helpers/parseError";
import { login } from "../services/slices/auth";

function Login() {
  const [signupMode, setSignupMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  function handleChanges(e) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  function handleLogin() {
    if (signupMode) {
      setSignupMode(false);
      return;
    }
    setLoading(true);
    axios
      .post("auth", credentials)
      .then((res) => {
        Cookies.set("token", res.data.token);
        window.location.reload();
      })
      .catch((err) => {
        setError(parseError(err));
        setLoading(false);
      });
  }

  function handleSignUp() {
    if (!signupMode) {
      setSignupMode(true);
      return;
    }
    setLoading(true);
    axios
      .post("auth/signup", credentials)
      .then((res) => {
        Cookies.set("token", res.data.token);
        window.location.reload();
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
        {signupMode ? "Sign Up" : "Log In"}
      </Typography>
      {signupMode && (
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          name="name"
          onChange={handleChanges}
          required
        />
      )}
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        name="email"
        onChange={handleChanges}
        required
      />
      <TextField
        fullWidth
        label="Password"
        variant="outlined"
        type="password"
        name="password"
        onChange={handleChanges}
        required
      />
      {loading && <LinearProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Stack
        direction={signupMode ? "row-reverse" : "row"}
        justifyContent="space-between"
      >
        <Button
          variant={signupMode ? "outlined" : "contained"}
          startIcon={<LoginIcon />}
          disabled={loading}
          onClick={handleLogin}
        >
          Log In
        </Button>
        <Button
          variant={signupMode ? "contained" : "outlined"}
          startIcon={<PersonAddAlt />}
          disabled={loading}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </Stack>
    </Stack>
  );
}

export default Login;
