'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

let persistor = persistStore(store);

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ProgressProvider
          height='0.2rem'
          color='#30af5b'
          options={{ showSpinner: false, easing: 'linear', speed: 200 }}
          shallowRouting
        >
          {children}
        </ProgressProvider>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
