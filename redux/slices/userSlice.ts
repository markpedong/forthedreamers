import { LOGINFORM_STATE } from '@/constants/types'
import { Addresses, Users } from '@prisma/client'
import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  userData: Users | null
  address: Addresses | null
}

const initialState: UserState = {
  userData: null,
  address: null
}

export const appSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setAddress: (state, action) => {
      state.address = action.payload
    }
  }
})

export const { setUserData, setAddress } = appSlice.actions
export default appSlice.reducer
