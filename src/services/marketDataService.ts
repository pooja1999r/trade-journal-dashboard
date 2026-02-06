/**
 * Market Data Service
 * WebSocket connection to Binance for real-time ticker prices.
 */

import type { MarketDataMap } from '../components/constants/types';

const WS_BASE = 'wss://stream.binance.com:9443/stream';

/** Normalize symbol to Binance stream pair (e.g. BTC → btcusdt, ETHBTC → ethbtc) */
function toBinanceStreamPair(symbol: string): string {
  const s = symbol.toUpperCase().trim();
  if (s.length >= 6) return s.toLowerCase(); // already a pair (ETHBTC, BTCUSDT)
  return `${s.toLowerCase()}usdt`;
}

interface BinanceTickerMessage {
  stream: string;
  data: {
    s: string;
    c: string;
    P?: string;
    h?: string;
    l?: string;
  };
}

/**
 * Subscribe to Binance ticker streams for given symbols.
 * Returns an unsubscribe function.
 */
export function subscribeMarketData(
  symbols: string[],
  onUpdate: (data: MarketDataMap) => void
): () => void {
  if (symbols.length === 0) {
    onUpdate({});
    return () => {};
  }

  const streamPairs: string[] = [];
  const pairToSymbol: Record<string, string> = {};
  for (const s of symbols) {
    const pair = toBinanceStreamPair(s);
    pairToSymbol[pair] = s.toUpperCase();
    streamPairs.push(`${pair}@ticker`);
  }
  const streams = streamPairs.join('/');
  const ws = new WebSocket(`${WS_BASE}?streams=${streams}`);

  const map: MarketDataMap = {};
  const now = new Date().toISOString();

  const applyUpdate = (binanceSymbol: string, last: string, changePct: string, high?: string, low?: string) => {
    const pair = binanceSymbol.toLowerCase();
    const displayKey = pairToSymbol[pair] ?? binanceSymbol.toUpperCase();
    map[displayKey] = {
      symbol: displayKey,
      last,
      last_btc: '1',
      lowest: low ?? last,
      highest: high ?? last,
      date: now,
      daily_change_percentage: changePct ?? '0',
      source_exchange: 'binance',
    };
    onUpdate({ ...map });
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data) as BinanceTickerMessage;
      const { s, c, P, h, l } = message.data ?? {};
      if (s && c) {
        applyUpdate(s, c, P ?? '0', h, l);
      }
    } catch {
      // ignore parse errors
    }
  };

  ws.onerror = () => {
    // Connection error - keep existing data, no new updates
  };

  return () => {
    ws.close();
  };
}
