/**
 * All trade and app types
 * Trade model, position, status, API responses, filters, etc.
 */

// ---- String literal constants ----

/** Position: LONG = bought to open, SHORT = sold to open */
export const POSITION = {
  LONG: 'LONG',
  SHORT: 'SHORT',
} as const;

/** Trade status: OPEN = still holding, CLOSED = exited */
export const TRADE_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

/** Entry leg: BUY = LONG open, SELL = SHORT open */
export const ENTRY_TYPE = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;

// ---- Trade types ----

export type Position = (typeof POSITION)[keyof typeof POSITION];

export type TradeStatus = (typeof TRADE_STATUS)[keyof typeof TRADE_STATUS];

export type EntryType = (typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE];

export interface Trade {
  id: string;
  symbol: string;
  position: Position;
  status: TradeStatus;
  openTimestamp: number;
  closeTimestamp?: number;
  openPrice: number;
  closePrice?: number;
  quantity: number;
  stopLoss?: number;
  rValue?: number;
  notes?: string;
  tags?: string[];
}

// ---- Market Data API types ----

export interface MarketSymbolData {
  symbol: string;
  last: string;
  last_btc: string;
  lowest: string;
  highest: string;
  date: string;
  daily_change_percentage: string;
  source_exchange: string;
}

export interface MarketDataApiResponse {
  status: string;
  symbols: MarketSymbolData[];
}

export interface MarketDataMap {
  [symbol: string]: MarketSymbolData;
}

// ---- Filter types ----

export interface TradeFilters {
  symbol: string;
  position: Position | '';
  status: TradeStatus | '';
  entryType: EntryType | '';
  tags: string[];
  searchNotes: string;
}

export type TradeFiltersType = TradeFilters;

// ---- Component-specific types ----

/** Tooltip info item: title, description, optional icon key */
export interface TooltipInfoItem {
  title: string;
  description: string;
  icon?: 'info' | 'help';
}

/** Filter dropdown keys used in TradeFilters */
export type DropdownKey = 'symbol' | 'position' | 'status' | 'entry' | 'tags';
