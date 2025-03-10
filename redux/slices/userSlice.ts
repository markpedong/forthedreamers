import { CartResponse } from '@/constants/types'
import { Addresses, PaymentMethods, Users } from '@prisma/client'
import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  userData: Users | null
  address: Addresses | null
  paymentMethod: PaymentMethods | null
  cartItems: CartResponse[]
}

const initialState: UserState = {
  userData: null,
  address: null,
  paymentMethod: null,
  cartItems: []
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
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload
    }
  }
})

export const { setUserData, setAddress, setPaymentMethod, setCartItems } = appSlice.actions
export default appSlice.reducer
