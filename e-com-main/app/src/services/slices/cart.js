const { createSlice } = require("@reduxjs/toolkit");

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    setCart: (state, action) => {
      return action.payload;
    },
    addToCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ id, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.find((item) => item.id === id);
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        return state.filter((item) => item.id !== id);
      }
    },
    deleteFromCart: (state, action) => {
      const id = action.payload;
      return state.filter((item) => item.id !== id);
    },
  },
});

export const { setCart, addToCart, removeFromCart, deleteFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
