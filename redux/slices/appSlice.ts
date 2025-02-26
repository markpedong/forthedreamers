import { LOGINFORM_STATE } from '@/constants/types'
import { createSlice } from '@reduxjs/toolkit'

interface AppState {
  loginFormState: LOGINFORM_STATE
}

const initialState: AppState = {
  loginFormState: LOGINFORM_STATE.LOGIN
}

export const appSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setLoginFormState: (state, action) => {
      state.loginFormState = action.payload
    }
  }
})

export const { setLoginFormState } = appSlice.actions
export default appSlice.reducer
