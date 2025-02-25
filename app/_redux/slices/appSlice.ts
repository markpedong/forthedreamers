import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface AppState {
  darkMode: boolean
}

// Define the initial state using that type
const initialState: AppState = {
  darkMode: false,
}

export const appSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    toggleDarkmode: (state) => {
      state.darkMode = !state.darkMode
    },
  },
})

export const { toggleDarkmode } = appSlice.actions
export default appSlice.reducer