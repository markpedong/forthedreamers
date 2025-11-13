import { Session, TVariant } from '@/lib/types';
import { createSlice } from '@reduxjs/toolkit';

type InitialSlice = {
  session: Session | null;
  selectedVariant: TVariant | null;
};
const initialState: InitialSlice = {
  session: null,
  selectedVariant: null,
};

export const AppSlice = createSlice({
  name: 'AppSlice',
  initialState,
  reducers: {
    setSessionData: (state, { payload }) => {
      state.session = payload;
    },
    setSelectedVariant: (state, { payload }) => {
      state.selectedVariant = payload;
    },
  },
});

export const { setSessionData, setSelectedVariant } = AppSlice.actions;
export default AppSlice.reducer;
