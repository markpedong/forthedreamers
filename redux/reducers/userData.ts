import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TUserData, TUserDataState } from '@/services/types'

const initialState: TUserDataState = {
  data: null
}

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<TUserData>) => {
      state.data = action.payload
    },
    clearUserData: state => {
      state.data = null
    }
  }
})

export const { setUserData, clearUserData } = userDataSlice.actions
export default userDataSlice.reducer
