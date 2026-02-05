/**
 * Domain Types for Trade Journal Application
 * 
 * These types define the core business domain:
 * - Trade: A position taken by a trader (can have multiple buy/sell legs)
 * - TradeLeg: A single buy or sell transaction within a trade
 */

/**
 * Represents a single buy or sell transaction leg
 */
export interface TradeLeg {
  id: string;
  price: number;
  quantity: number;
  timestamp: string; // ISO 8601 format
}

/**
 * Trade direction - whether the trader is going long or short
 */
export type TradeDirection = 'LONG' | 'SHORT';

/**
 * Trade status - whether the position is still open or has been closed
 */
export type TradeStatus = 'OPEN' | 'CLOSED';

/**
 * Main Trade entity
 * Represents a complete trading position with multiple entry and exit points
 */
export interface Trade {
  id: string;
  symbol: string; // e.g., AAPL, BTCUSDT, NIFTY
  direction: TradeDirection;
  status: TradeStatus;
  buyLegs: TradeLeg[];
  sellLegs: TradeLeg[];
  createdAt: string; // ISO 8601 format
  notes?: string;
}

/**
 * Redux state shape
 */
export interface TradeState {
  trades: Trade[];
}
