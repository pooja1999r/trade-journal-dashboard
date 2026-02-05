/**
 * Trade Storage Service
 * Handles localStorage persistence for trades under key: trade_journal_trades
 * Keeps persistence logic separate from UI
 */

import { Trade } from '../types';

const STORAGE_KEY = 'trade_journal_trades';

export const tradeStorageService = {
  getAll(): Trade[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized === null) return [];
      const trades = JSON.parse(serialized) as Trade[];
      return trades.map((t) => ({
        ...t,
        status: t.status ?? 'CLOSED',
      }));
    } catch (error) {
      console.error('Failed to load trades from localStorage:', error);
      return [];
    }
  },

  save(trades: Trade[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    } catch (error) {
      console.error('Failed to save trades to localStorage:', error);
    }
  },

  getUniqueSymbols(trades: Trade[]): string[] {
    const symbols = new Set(trades.map((t) => t.symbol.toUpperCase()));
    return Array.from(symbols);
  },
};
