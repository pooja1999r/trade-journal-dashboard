/**
 * Redux Slice for Trade Management
 * 
 * Uses Redux Toolkit for cleaner, more maintainable state management.
 * All trade-related actions and reducers are defined here.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trade, TradeLeg, TradeState } from './types';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';

/**
 * Initial state - loads from localStorage if available
 */
const initialState: TradeState = {
  trades: loadFromLocalStorage(),
};

const tradeSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    /**
     * Add a new trade to the store
     */
    addTrade: (state, action: PayloadAction<Trade>) => {
      state.trades.push(action.payload);
      saveToLocalStorage(state.trades);
    },

    /**
     * Add a buy leg to an existing trade
     */
    addBuyLeg: (state, action: PayloadAction<{ tradeId: string; leg: TradeLeg }>) => {
      const trade = state.trades.find(t => t.id === action.payload.tradeId);
      if (trade) {
        trade.buyLegs.push(action.payload.leg);
        saveToLocalStorage(state.trades);
      }
    },

    /**
     * Add a sell leg to an existing trade
     */
    addSellLeg: (state, action: PayloadAction<{ tradeId: string; leg: TradeLeg }>) => {
      const trade = state.trades.find(t => t.id === action.payload.tradeId);
      if (trade) {
        trade.sellLegs.push(action.payload.leg);
        saveToLocalStorage(state.trades);
      }
    },

    /**
     * Close an open trade
     */
    closeTrade: (state, action: PayloadAction<string>) => {
      const trade = state.trades.find(t => t.id === action.payload);
      if (trade) {
        trade.status = 'CLOSED';
        saveToLocalStorage(state.trades);
      }
    },

    /**
     * Update trade notes
     */
    updateTradeNotes: (state, action: PayloadAction<{ tradeId: string; notes: string }>) => {
      const trade = state.trades.find(t => t.id === action.payload.tradeId);
      if (trade) {
        trade.notes = action.payload.notes;
        saveToLocalStorage(state.trades);
      }
    },

    /**
     * Delete a trade
     */
    deleteTrade: (state, action: PayloadAction<string>) => {
      state.trades = state.trades.filter(t => t.id !== action.payload);
      saveToLocalStorage(state.trades);
    },

    /**
     * Load mock data (for testing/demo purposes)
     */
    loadMockData: (state, action: PayloadAction<Trade[]>) => {
      state.trades = action.payload;
      saveToLocalStorage(state.trades);
    },
  },
});

export const {
  addTrade,
  addBuyLeg,
  addSellLeg,
  closeTrade,
  updateTradeNotes,
  deleteTrade,
  loadMockData,
} = tradeSlice.actions;

export default tradeSlice.reducer;
