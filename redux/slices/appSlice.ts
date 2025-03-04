import { LOGINFORM_STATE } from '@/constants/types'
import { Users } from '@prisma/client'
import { createSlice } from '@reduxjs/toolkit'

interface AppState {
  loginFormState: LOGINFORM_STATE
  darkMode: boolean
}

const initialState: AppState = {
  loginFormState: LOGINFORM_STATE.LOGIN,
  darkMode: false
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
    }
  }
})

export const { setLoginFormState, toggleDarkMode } = appSlice.actions
export default appSlice.reducer
