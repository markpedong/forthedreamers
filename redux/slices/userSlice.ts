import { LOGINFORM_STATE } from '@/constants/types'
import { Addresses, Users } from '@prisma/client'
import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  userData: Users | null
  address: Addresses | null
  isNewAddress: boolean
}

const initialState: UserState = {
  userData: null,
  address: null,
  isNewAddress: false
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
    },
    setIsNewAddress: (state, action) => {
      state.isNewAddress = action.payload
    }
  }
})

export const { setUserData, setAddress, setIsNewAddress } = appSlice.actions
export default appSlice.reducer
