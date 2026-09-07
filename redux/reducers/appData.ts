import { TAppDataState } from "@/services/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TAppDataState = {
  theme: null
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    resetAppDataState: () => initialState,
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  resetAppDataState,
  setTheme
} = appDataSlice.actions;

export default appDataSlice.reducer;
