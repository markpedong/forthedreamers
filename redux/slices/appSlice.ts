import { LOGINFORM_STATE } from '@/constants/types'
import { Users } from '@prisma/client'
import { createSlice } from '@reduxjs/toolkit'
import { m } from 'framer-motion'

interface AppState {
  loginFormState: LOGINFORM_STATE
  darkMode: boolean
  userData: Users | null
}

const initialState: AppState = {
  loginFormState: LOGINFORM_STATE.LOGIN,
  darkMode: false,
  userData: null
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
    setUserData: (state, action) => {
      state.userData = action.payload
    }
  }
})

export const { setLoginFormState, toggleDarkMode, setUserData } = appSlice.actions
export default appSlice.reducer
