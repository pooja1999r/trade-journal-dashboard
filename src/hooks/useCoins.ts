/**
 * useCoins hook
 * Loads trading symbols from localStorage for symbol selection
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchCoinsList } from '../services/coinsService';
import type { TradingSymbol } from '../services/coinsService';

export function useCoins() {
  const [coins, setCoins] = useState<TradingSymbol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCoinsList();
      setCoins(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load coins');
      setCoins([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  return { coins, isLoading, error, refetch: loadCoins };
}
