import { LOGINFORM_STATE } from '@/constants/types'
import { Users } from '@prisma/client'
import { createSlice } from '@reduxjs/toolkit'

interface AppState {
  loginFormState: LOGINFORM_STATE
  darkMode: boolean
  hasDefaultAddress: boolean
}

const initialState: AppState = {
  loginFormState: LOGINFORM_STATE.LOGIN,
  darkMode: false,
  hasDefaultAddress: false
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
    }
  }
})

export const { setLoginFormState, toggleDarkMode, setHasDefaultAddress } = appSlice.actions
export default appSlice.reducer
