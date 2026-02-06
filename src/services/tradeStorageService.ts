/**
 * Trade Storage Service
 * Handles localStorage persistence for trades under key: trade_journal_trades
 * Keeps persistence logic separate from UI
 * Syncs trade_journal_symbols to only contain symbols present in trades
 */

import { Trade } from '../components/constants/types';

const STORAGE_KEY = 'trade_journal_trades';
const SYMBOLS_KEY = 'trade_journal_symbols';

function syncSymbolsFromTrades(trades: Trade[]): void {
  const symbols = new Set(trades.map((t) => t.symbol.toUpperCase()));
  try {
    localStorage.setItem(SYMBOLS_KEY, JSON.stringify(Array.from(symbols)));
  } catch {
    // ignore
  }
}

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
      syncSymbolsFromTrades(trades);
    } catch (error) {
      console.error('Failed to save trades to localStorage:', error);
    }
  },

  syncSymbolsFromTrades(trades: Trade[]): void {
    syncSymbolsFromTrades(trades);
  },

  getUniqueSymbols(trades: Trade[]): string[] {
    const symbols = new Set(trades.map((t) => t.symbol.toUpperCase()));
    return Array.from(symbols);
  },
};
