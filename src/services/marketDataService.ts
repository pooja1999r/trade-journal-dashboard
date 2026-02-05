/**
 * Market Data Service
 * Fetches live crypto prices from API for symbols stored in trades.
 * Batches requests and handles loading/error states.
 * Falls back to mock data when API is unavailable (e.g. no VITE_API_URL).
 */

import type { MarketDataMap } from '../types';
import { getMockMarketData } from '../utils/mockMarketData';

const API_URL = import.meta.env.VITE_API_URL || '';
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * Fetch market data for given symbols.
 * API key passed via Authorization header.
 * Returns a map of symbol -> market data for efficient lookup.
 * Falls back to mock data if API URL not configured or request fails.
 */
export async function fetchMarketData(symbols: string[]): Promise<MarketDataMap> {
  if (symbols.length === 0) return {};

  const normalizedSymbols = symbols.map((s) => s.toUpperCase());

  if (!API_URL) {
    return getMockMarketData(normalizedSymbols);
  }

  try {
    // FreeCryptoAPI: ?symbol=BTC or ?symbol=BTC+ETH
    const symbolParam = normalizedSymbols.join('+');
    const url = `${API_URL}?symbol=${encodeURIComponent(symbolParam)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY ? `Bearer ${API_KEY}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Market data API error: ${response.status}`);
    }

    const json = await response.json();

    // Adapt FreeCryptoAPI response (price, change_24h) to our MarketDataMap
    const map: MarketDataMap = {};
    const items = Array.isArray(json) ? json : json?.data ?? json?.symbols ?? [];
    for (const item of items) {
      const symbol = (item.symbol || item.Symbol || '').toUpperCase();
      if (!symbol) continue;
      map[symbol] = {
        symbol,
        last: String(item.last ?? item.price ?? item.Last ?? item.Price ?? 0),
        last_btc: '1',
        lowest: String(item.lowest ?? item.low ?? item.Last ?? item.price ?? 0),
        highest: String(item.highest ?? item.high ?? item.Last ?? item.price ?? 0),
        date: item.date ?? item.Date ?? new Date().toISOString(),
        daily_change_percentage: String(
          item.daily_change_percentage ?? item.change_24h ?? item.change ?? 0
        ),
        source_exchange: item.source_exchange ?? item.exchange ?? 'unknown',
      };
    }

    return map;
  } catch {
    return getMockMarketData(normalizedSymbols);
  }
}
