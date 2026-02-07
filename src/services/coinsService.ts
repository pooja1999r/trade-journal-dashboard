/**
 * Trading symbols service
 * Fetches symbol list and ticker price from Binance API
 */

export interface TradingSymbol {
  id: string;
  symbol: string;
}

/** Binance ticker/price response */
export interface TickerPrice {
  symbol: string;
  price: string;
}

const BINANCE_API = 'https://api.binance.com/api/v3';

export async function fetchCoinsList(): Promise<TradingSymbol[]> {
  const res = await fetch(`${BINANCE_API}/exchangeInfo`);
  const data = await res.json();
  const symbols = (data.symbols ?? []).map((s: { symbol: string }) => s.symbol);
  return symbols.map((sym: string) => ({ id: sym, symbol: sym }));
}

/**
 * Fetches current price for a symbol from Binance ticker/price.
 * @param symbol e.g. "BTCUSDT"
 * @returns { symbol, price } or throws on error
 */
export async function fetchTickerPrice(symbol: string): Promise<TickerPrice> {
  const res = await fetch(`${BINANCE_API}/ticker/price?symbol=${encodeURIComponent(symbol.toUpperCase())}`);
  if (!res.ok) {
    throw new Error(`Binance ticker failed: ${res.status}`);
  }
  const data = await res.json();
  return { symbol: data.symbol, price: data.price };
}