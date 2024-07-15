import { createSlice } from '@reduxjs/toolkit'

type InitialSlice = {
	userInfo: {}
}
const initialState: InitialSlice = {
	userInfo: {}
}

export const AppDataSlice = createSlice({
	name: 'appData',
	initialState,
	reducers: {
		setUserInfo: state => ({ ...state, userInfo: state.userInfo })
	}
})

export const { setUserInfo } = AppDataSlice.actions
export default AppDataSlice.reducer
