'use client'

import {combineReducers, configureStore, createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer} from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import {toast} from 'sonner'
import {setWishlist as setWishlistRequest} from '@/lib/http'

export type Theme = 'dark' | 'light' | 'system'
export type ResolvedTheme = Exclude<Theme, 'system'>

type AppState = {
  cartCount: number
  wishlistIds: string[]
  pendingWishlistIds: string[]
  theme: Theme
  resolvedTheme: ResolvedTheme
}

const initialState: AppState = {
  cartCount: 0,
  wishlistIds: [],
  pendingWishlistIds: [],
  theme: 'system',
  resolvedTheme: 'light'
}

const storage = typeof window === 'undefined'
  ? {
      getItem: async () => null,
      setItem: async (_key: string, value: string) => value,
      removeItem: async () => undefined
    }
  : createWebStorage('local')

export const toggleWishlist = createAsyncThunk<
  {id: string; wanted: boolean},
  {id: string; wanted: boolean},
  {state: {app: AppState}; rejectValue: string}
>(
  'app/toggleWishlist',
  async ({id, wanted}, {rejectWithValue}) => {
    try {
      const result = await setWishlistRequest(id, wanted)

      if (!result.success || !result.data) {
        const message = result.message ?? 'Unable to update wishlist'
        toast.error(message)
        return rejectWithValue(message)
      }

      toast.success(result.message)
      return {id, wanted: result.data.wanted}
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update wishlist'
      toast.error(message)
      return rejectWithValue(message)
    }
  },
  {
    condition: ({id}, {getState}) => !getState().app.pendingWishlistIds.includes(id)
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload
    },
    incrementCartCount: state => {
      state.cartCount += 1
    },
    decrementCartCount: state => {
      state.cartCount = Math.max(0, state.cartCount - 1)
    },
    setWishlistIds: (state, action: PayloadAction<string[]>) => {
      state.wishlistIds = action.payload
    },
    resetAccountState: state => {
      state.cartCount = 0
      state.wishlistIds = []
      state.pendingWishlistIds = []
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    setResolvedTheme: (state, action: PayloadAction<ResolvedTheme>) => {
      state.resolvedTheme = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(toggleWishlist.pending, (state, action) => {
        const {id, wanted} = action.meta.arg
        state.wishlistIds = wanted
          ? [...new Set([...state.wishlistIds, id])]
          : state.wishlistIds.filter(value => value !== id)
        state.pendingWishlistIds.push(id)
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const {id, wanted} = action.payload
        state.wishlistIds = wanted
          ? [...new Set([...state.wishlistIds, id])]
          : state.wishlistIds.filter(value => value !== id)
        state.pendingWishlistIds = state.pendingWishlistIds.filter(value => value !== id)
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        const {id, wanted} = action.meta.arg
        state.wishlistIds = wanted
          ? state.wishlistIds.filter(value => value !== id)
          : [...new Set([...state.wishlistIds, id])]
        state.pendingWishlistIds = state.pendingWishlistIds.filter(value => value !== id)
      })
  }
})

export const {
  decrementCartCount,
  incrementCartCount,
  resetAccountState,
  setCartCount,
  setResolvedTheme,
  setTheme,
  setWishlistIds
} = appSlice.actions

const reducer = combineReducers({
  app: persistReducer(
    {key: 'app', storage, whitelist: ['theme']},
    appSlice.reducer
  )
})

export const makeStore = () => configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
})

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
