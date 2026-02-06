/**
 * useMarketData hook
 *
 * Subscribes to Binance ticker via centralized WebSocket manager.
 * Auto-cleanup on unmount. No WebSocket created inside component.
 */

import { useState, useEffect, useMemo } from 'react';
import type { MarketDataMap } from '../components/constants/types';
import { subscribeMarketData } from '../services/marketDataService';

export function useMarketData(symbols: string[], reconnectTrigger?: number) {
  const [data, setData] = useState<MarketDataMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const symbolsKey = useMemo(() => symbols.join(','), [symbols]);

  useEffect(() => {
    const syms = symbolsKey ? symbolsKey.split(',').filter(Boolean) : [];
    if (syms.length === 0) {
      setData({});
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const timer = setTimeout(() => {
      if (cancelled) return;
      unsubscribe = subscribeMarketData(syms, (newData) => {
        if (cancelled) return;
        setData(newData);
        setIsLoading(false);
        setError(null);
      });
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      unsubscribe?.();
    };
  }, [symbolsKey, reconnectTrigger]);

  return { data, isLoading, error, refetch: () => {} };
}
