/**
 * Trade Calculation Utilities
 * 
 * Helper functions for calculating trade metrics and statistics.
 * These are pure functions with no side effects.
 */

import { Trade, TradeLeg } from '../store/types';

/**
 * Calculate total quantity from an array of legs
 */
export const calculateTotalQuantity = (legs: TradeLeg[]): number => {
  return legs.reduce((sum, leg) => sum + leg.quantity, 0);
};

/**
 * Calculate weighted average price from an array of legs
 */
export const calculateAveragePrice = (legs: TradeLeg[]): number => {
  if (legs.length === 0) return 0;
  
  const totalValue = legs.reduce((sum, leg) => sum + (leg.price * leg.quantity), 0);
  const totalQuantity = calculateTotalQuantity(legs);
  
  return totalQuantity > 0 ? totalValue / totalQuantity : 0;
};

/**
 * Calculate total value (price * quantity) for all legs
 */
export const calculateTotalValue = (legs: TradeLeg[]): number => {
  return legs.reduce((sum, leg) => sum + (leg.price * leg.quantity), 0);
};

/**
 * Calculate P&L for a trade
 * For LONG positions: (Sell Value - Buy Value)
 * For SHORT positions: (Buy Value - Sell Value)
 */
export const calculatePnL = (trade: Trade): number => {
  const buyValue = calculateTotalValue(trade.buyLegs);
  const sellValue = calculateTotalValue(trade.sellLegs);
  
  if (trade.direction === 'LONG') {
    return sellValue - buyValue;
  } else {
    return buyValue - sellValue;
  }
};

/**
 * Format currency with proper decimal places
 */
export const formatCurrency = (value: number): string => {
  return value.toFixed(2);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};
