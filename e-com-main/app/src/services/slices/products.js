const { createSlice } = require("@reduxjs/toolkit");

const productsSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    setProducts: (_, action) => {
      return action.payload;
    },
  },
});

export const { setProducts } = productsSlice.actions;

export default productsSlice.reducer;
