/**
 * Market Data Service
 *
 * Subscribes to Binance ticker streams. Each call closes any existing
 * connection and opens a new one. Call the returned cleanup on unmount.
 */

import type { MarketDataMap } from '../components/constants/types';

const WS_BASE = 'wss://stream.binance.com:9443/stream';

let currentWs: WebSocket | null = null;

function toMarketSymbolData(data: {
  s: string;
  c: string;
  h?: string;
  l?: string;
  v?: string;
  P?: string;
}): MarketDataMap[string] {
  return {
    symbol: data.s,
    last: String(data.c),
    last_btc: '1',
    lowest: String(data.l ?? data.c),
    highest: String(data.h ?? data.c),
    date: new Date().toISOString(),
    daily_change_percentage: String(data.P ?? '0'),
    source_exchange: 'binance',
  };
}

/**
 * Subscribe to market data for symbols. Callback receives updates.
 * Each call closes any previous connection and opens a new one.
 * Return cleanup to close on unmount.
 */
export function subscribeMarketData(
  symbols: string[],
  callback: (data: MarketDataMap) => void
): () => void {
  const trimmed = symbols.map((s) => s.trim().toUpperCase()).filter(Boolean);

  const previousWs = currentWs;

  if (trimmed.length === 0) {
    if (previousWs) {
      previousWs.close();
      currentWs = null;
    }
    callback({});
    return () => {};
  }

  const streams = trimmed
    .map((symbol) => `${symbol.toLowerCase()}@ticker`)
    .join('/');
  const wsUrl = `${WS_BASE}?streams=${streams}`;

  const ws = new WebSocket(wsUrl);
  currentWs = ws;

  const dataMap: MarketDataMap = {};

  ws.onopen = () => {
    if (previousWs) {
      previousWs.close();
    }
  };

  ws.onmessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      const data = message?.data;
      if (!data || !data.s || !data.c) return;

      dataMap[data.s] = toMarketSymbolData(data);
      callback({ ...dataMap });
    } catch {
      // ignore parse errors
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    if (currentWs === ws) {
      currentWs = null;
    }
  };

  return () => {
    if (currentWs === ws) {
      currentWs.close();
      currentWs = null;
    }
    if (previousWs) {
      previousWs.close();
    }
  };
}
