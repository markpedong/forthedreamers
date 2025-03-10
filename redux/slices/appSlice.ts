import { LOGINFORM_STATE } from '@/constants/types'
import { Users } from '@prisma/client'
import { createSlice } from '@reduxjs/toolkit'

interface AppState {
  loginFormState: LOGINFORM_STATE
  sellerFormState: LOGINFORM_STATE
  darkMode: boolean
  hasDefaultAddress: boolean
  isCartOpen: boolean
  hasChangesInCart: boolean
}

const initialState: AppState = {
  loginFormState: LOGINFORM_STATE.USER_LOGIN,
  sellerFormState: LOGINFORM_STATE.USER_LOGIN,
  darkMode: false,
  hasDefaultAddress: false,
  isCartOpen: false,
  hasChangesInCart: false
}

export const appSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setLoginFormState: (state, action) => {
      state.loginFormState = action.payload
    },
    toggleDarkMode: state => {
      state.darkMode = !state.darkMode
    },
    setHasDefaultAddress: (state, action) => {
      state.hasDefaultAddress = action.payload
    },
    setSellerFormState: (state, action) => {
      state.sellerFormState = action.payload
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload
    },
    setHasChangesInCart: (state, action) => {
      state.hasChangesInCart = action.payload
    }
  }
})

export const {
  setLoginFormState,
  toggleDarkMode,
  setHasDefaultAddress,
  setSellerFormState,
  setCartOpen,
  setHasChangesInCart
} = appSlice.actions
export default appSlice.reducer
