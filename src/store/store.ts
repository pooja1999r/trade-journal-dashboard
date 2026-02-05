/**
 * Redux Store Configuration
 * 
 * Central store for the entire application state.
 * Uses Redux Toolkit's configureStore for optimal setup.
 */

import { configureStore } from '@reduxjs/toolkit';
import tradeReducer from './tradeSlice';

export const store = configureStore({
  reducer: {
    trades: tradeReducer,
  },
});

// Infer RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
