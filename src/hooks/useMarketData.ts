/**
 * useMarketData hook
 * Fetches live market data for symbols present in trades.
 * Syncs via useEffect when symbols change.
 */

import { useState, useEffect, useCallback } from 'react';
import type { MarketDataMap } from '../components/constants/types';
import { fetchMarketData } from '../services/marketDataService';

const POLL_INTERVAL_MS = 60000; // 1 minute

export function useMarketData(symbols: string[]) {
  const [data, setData] = useState<MarketDataMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMarketData = useCallback(async () => {
    if (symbols.length === 0) {
      setData({});
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchMarketData(symbols);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      setData({});
    } finally {
      setIsLoading(false);
    }
  }, [symbols.join(',')]);

  useEffect(() => {
    loadMarketData();

    const interval = setInterval(loadMarketData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadMarketData]);

  return { data, isLoading, error, refetch: loadMarketData };
}
