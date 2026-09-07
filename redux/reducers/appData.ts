import { ProfileTab, TAppDataState } from "@/services/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TAppDataState = {
  theme: null,
  currentProfileTab: null
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    resetAppDataState: () => initialState,
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setCurrentProfileTab: (state, action: PayloadAction<ProfileTab>) => {
      state.currentProfileTab = action.payload;
    },
  },
});

export const {
  resetAppDataState,
  setTheme,
  setCurrentProfileTab
} = appDataSlice.actions;

export default appDataSlice.reducer;
