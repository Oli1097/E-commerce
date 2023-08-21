const { createSlice } = require("@reduxjs/toolkit");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    token: null,
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    setBalance: (state, action) => {
      state.user.bank_balance = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, setUser, setToken, setBalance, logout } =
  authSlice.actions;

export default authSlice.reducer;
