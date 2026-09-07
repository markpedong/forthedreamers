import { TCartDataState } from "@/services/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TCartDataState = {
  cartCount: 0,
};

const cartDataSlice = createSlice({
  name: 'cartData',
  initialState,
  reducers: {
    incrementCartCount: (state) => {
      state.cartCount += 1;
    },
    decrementCartCount: (state) => {
      state.cartCount -= 1;
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
  },
});

export const {
  incrementCartCount,
  decrementCartCount,
  setCartCount,
} = cartDataSlice.actions;

export default cartDataSlice.reducer;
