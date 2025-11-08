import { Session } from '@/lib/types';
import { createSlice } from '@reduxjs/toolkit';

type InitialSlice = {
  session: Session | null;
};
const initialState: InitialSlice = {
  session: null,
};

export const AppSlice = createSlice({
  name: 'AppSlice',
  initialState,
  reducers: {
    setSessionData: (state, { payload }) => {
      state.session = payload;
    },
  },
});

export const { setSessionData } = AppSlice.actions;
export default AppSlice.reducer;
