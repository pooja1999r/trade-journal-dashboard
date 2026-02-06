/**
 * Trading symbols service
 * Loads symbol list from localStorage (hardcoded defaults)
 */

export interface TradingSymbol {
  id: string;
  symbol: string;
}

const STORAGE_KEY = 'trade_journal_symbols';

const DEFAULT_SYMBOLS = ['ETHBTC', 'LTCBTC', 'BNBBTC', 'NEOBTC', 'QTUMETH'];

function getDefaultTradingSymbols(): TradingSymbol[] {
  return DEFAULT_SYMBOLS.map((s) => ({ id: s, symbol: s }));
}

function loadFromStorage(): TradingSymbol[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((s) => ({ id: s, symbol: s }));
      }
    }
  } catch {
    // ignore parse errors
  }
  const defaults = getDefaultTradingSymbols();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SYMBOLS));
  return defaults;
}

export async function fetchCoinsList(): Promise<TradingSymbol[]> {
  return Promise.resolve(loadFromStorage());
}
