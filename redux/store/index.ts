'use client';

import { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore, type PersistedState } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
// Import your reducers here
import appDataReducer from '../reducers/appData';
import userDataReducer from '../reducers/userData';
import type { TAppDataState } from '@/services/types';

// Define the root state
export type RootState = {
  appData: ReturnType<typeof appDataReducer>;
  userData: ReturnType<typeof userDataReducer>;
};

const rootReducer = combineReducers({
  appData: appDataReducer,
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

const getDefaultAppData = (): TAppDataState => ({
  theme:
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  currentProfileTab: 'profile',
});

type PersistedRootState = PersistedState & { appData?: Partial<TAppDataState> };

const persistConfig = {
  key: 'root',
  version: 4,
  storage,
  whitelist: ['appData'],
  migrate: async (state: PersistedState) => {
    const persistedState = state as PersistedRootState | undefined;
    if (!persistedState) return persistedState;

    const defaults = getDefaultAppData();
    return {
      _persist: persistedState._persist,
      appData: {
        ...persistedState.appData,
        theme:
          persistedState.appData?.theme === 'light' || persistedState.appData?.theme === 'dark'
            ? persistedState.appData.theme
            : defaults.theme,
        currentProfileTab: persistedState.appData?.currentProfileTab ?? defaults.currentProfileTab,
      },
    };
  },
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
