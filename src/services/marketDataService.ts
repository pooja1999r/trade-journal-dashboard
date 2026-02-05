/**
 * Market Data Service
 * Fetches live crypto prices from API for symbols stored in trades.
 * Batches requests and handles loading/error states.
 * Falls back to mock data when API is unavailable (e.g. no VITE_API_URL).
 */

import type { MarketDataApiResponse, MarketDataMap } from '../types';
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
    const symbolParam = normalizedSymbols.join(',');
    const url = `${API_URL}?symbols=${encodeURIComponent(symbolParam)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY ? `Bearer ${API_KEY}` : '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Market data API error: ${response.status}`);
    }

    const json: MarketDataApiResponse = await response.json();

    if (json.status !== 'success' || !json.symbols) {
      throw new Error('Invalid market data response');
    }

    const map: MarketDataMap = {};
    for (const item of json.symbols) {
      map[item.symbol.toUpperCase()] = item;
    }

    return map;
  } catch {
    return getMockMarketData(normalizedSymbols);
  }
}
