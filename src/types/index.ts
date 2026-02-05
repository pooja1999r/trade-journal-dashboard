/**
 * Domain Types for Trade Journal Application
 * Trade model with single entry/exit for crypto trading
 */

export type Position = 'LONG' | 'SHORT';

export interface Trade {
  id: string;
  symbol: string; // BTC, ETH, etc.
  position: Position;
  openTimestamp: number;
  closeTimestamp: number;
  openPrice: number;
  closePrice: number;
  quantity: number;
  stopLoss?: number;
  rValue?: number;
  notes?: string;
  tags?: string[];
}

/**
 * Market Data API Response Types
 */
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

/**
 * Filter state for the trade table
 */
export interface TradeFilters {
  symbol: string;
  position: Position | '';
  tags: string[];
  searchNotes: string;
}

export type TradeFiltersType = TradeFilters;
