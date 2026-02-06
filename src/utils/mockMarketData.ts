/**
 * Mock market data for development when API is not configured.
 * Used when fetchMarketData fails or VITE_API_URL is not set.
 */

import type { MarketDataMap } from '../components/constants/types';

const MOCK_PRICES: Record<string, { last: number; change: number }> = {
  BTC: { last: 63556.38, change: -13.53 },
  ETH: { last: 3456.12, change: -8.2 },
  SOL: { last: 142.5, change: 5.3 },
  XRP: { last: 0.52, change: -2.1 },
  DOGE: { last: 0.08, change: 1.5 },
};

export function getMockMarketData(symbols: string[]): MarketDataMap {
  const map: MarketDataMap = {};
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  for (const symbol of symbols) {
    const upper = symbol.toUpperCase();
    const mock = MOCK_PRICES[upper] || { last: 100, change: 0 };
    map[upper] = {
      symbol: upper,
      last: String(mock.last),
      last_btc: upper === 'BTC' ? '1' : String(mock.last / 63556),
      lowest: String(mock.last * 0.95),
      highest: String(mock.last * 1.1),
      date: now,
      daily_change_percentage: String(mock.change),
      source_exchange: 'binance',
    };
  }

  return map;
}
