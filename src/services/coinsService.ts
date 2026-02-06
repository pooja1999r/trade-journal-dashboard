/**
 * CoinGecko coins list service
 * Fetches crypto symbols from CoinGecko API
 */

export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
}

const API_URL = 'https://api.coingecko.com/api/v3/coins/list';

export async function fetchCoinsList(): Promise<CoinGeckoCoin[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch coins: ${response.status}`);
  }

  const data = await response.json();
  return data as CoinGeckoCoin[];
}
