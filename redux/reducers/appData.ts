import { ProfileTab, TAppDataState, Theme } from "@/services/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TAppDataState = {
  theme:
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  currentProfileTab: 'profile'
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    resetAppDataState: () => initialState,
    setTheme: (state, action: PayloadAction<Theme>) => {
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
