'use client';

import { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
// Import your reducers here
import appDataReducer from '../reducers/appData';
import cartDataReducer from '../reducers/cartData';
import userDataReducer from '../reducers/userData';

// Define the root state
export type RootState = {
  appData: ReturnType<typeof appDataReducer>;
  cartData: ReturnType<typeof cartDataReducer>;
  userData: ReturnType<typeof userDataReducer>;
};

const rootReducer = combineReducers({
  appData: appDataReducer,
  cartData: cartDataReducer,
  userData: userDataReducer,
});

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
  key: 'root',
  version: 2,
  storage,
  blacklist: ['userData'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV === 'development' ? { maxAge: 30, trace: false } : false,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    });
  },
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootStore = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
