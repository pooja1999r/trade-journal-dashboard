/**
 * Trading symbols service
 * Fetches symbol list from Binance API
 */

export interface TradingSymbol {
  id: string;
  symbol: string;
}

const BINANCE_API = 'https://api.binance.com/api/v3/exchangeInfo';

export async function fetchCoinsList(): Promise<TradingSymbol[]> {
  const res = await fetch(BINANCE_API);
  const data = await res.json();
  const symbols = (data.symbols ?? []).map((s: { symbol: string }) => s.symbol);
  return symbols.map((sym: string) => ({ id: sym, symbol: sym }));
}
