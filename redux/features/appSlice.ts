import { Session } from '@/lib/types';
import { createSlice } from '@reduxjs/toolkit';

type InitialSlice = {
  userData: Session | null;
};
const initialState: InitialSlice = {
  userData: null,
};

export const AppSlice = createSlice({
  name: 'AppSlice',
  initialState,
  reducers: {
    setSessionData: (state, { payload }) => {
      state.userData = payload;
    },
  },
});

export const { setSessionData } = AppSlice.actions;
export default AppSlice.reducer;
