import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Alert, CircularProgress, Container, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import AuthBar from "./components/AuthBar";
import Index from "./components/Index";
import Login from "./components/Login";
import axios from "./axios";
import parseError from "./helpers/parseError";
import { setUser } from "./services/slices/auth";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .get("auth")
        .then((res) => {
          dispatch(setUser(res.data));
        })
        .catch((err) => {
          setError(parseError(err));
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  return (
    <>
      {isAuthenticated && <AuthBar />}
      <Container sx={{ minHeight: "100vh" }}>
        <Stack
          minHeight="100vh"
          width="100%"
          alignItems="center"
          margin="auto"
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {!isAuthenticated ? <Login /> : <Index />}
              {error && (
                <Alert
                  severity="error"
                  sx={{ position: "fixed", bottom: 10, left: 10 }}
                >
                  {error}
                </Alert>
              )}
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default App;
