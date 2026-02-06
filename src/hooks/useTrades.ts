/**
 * useTrades hook
 * Manages trade state synced with localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { Trade } from '../components/constants/types';
import { tradeStorageService } from '../services/tradeStorageService';

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>(() => tradeStorageService.getAll());

  const loadTrades = useCallback(() => {
    setTrades(tradeStorageService.getAll());
  }, []);

  const addTrade = useCallback((trade: Trade) => {
    setTrades((prev) => {
      const next = [...prev, trade];
      tradeStorageService.save(next);
      return next;
    });
  }, []);

  const updateTrade = useCallback((id: string, updates: Partial<Trade>) => {
    setTrades((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      tradeStorageService.save(next);
      return next;
    });
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setTrades((prev) => {
      const next = prev.filter((t) => t.id !== id);
      tradeStorageService.save(next);
      return next;
    });
  }, []);

  useEffect(() => {
    tradeStorageService.syncSymbolsFromTrades(tradeStorageService.getAll());
    loadTrades();
  }, [loadTrades]);

  return { trades, addTrade, updateTrade, deleteTrade, loadTrades };
}
