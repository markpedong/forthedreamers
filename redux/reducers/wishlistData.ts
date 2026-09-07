import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TWishlistState {
  ids: string[]
}

const initialState: TWishlistState = {
  ids: []
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addWishlist: (state, action: PayloadAction<string>) => {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload)
      }
    },

    removeWishlist: (state, action: PayloadAction<string>) => {
      state.ids = state.ids.filter(id => id !== action.payload)
    },

    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload

      if (state.ids.includes(id)) {
        state.ids = state.ids.filter(itemId => itemId !== id)
      } else {
        state.ids.push(id)
      }
    },

    setWishlistIds: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload
    }
  }
})

export const { addWishlist, removeWishlist, toggleWishlist, setWishlistIds } = wishlistSlice.actions

export default wishlistSlice.reducer