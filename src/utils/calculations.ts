/**
 * Trade calculation utilities
 * Pure functions for PNL, duration, R-multiple
 */

import type { Position } from '../components/constants/types';

/**
 * PNL calculation:
 * LONG  → (closePrice - openPrice) × quantity
 * SHORT → (openPrice - closePrice) × quantity
 */
export function calculatePnL(
  position: Position,
  openPrice: number,
  closePrice: number,
  quantity: number
): number {
  if (position === 'LONG') {
    return (closePrice - openPrice) * quantity;
  }
  return (openPrice - closePrice) * quantity;
}

/**
 * Total duration in milliseconds
 */
export function getDurationMs(openTimestamp: number, closeTimestamp: number): number {
  return closeTimestamp - openTimestamp;
}

/**
 * Human-readable duration (e.g., "2h 15m", "3d 4h")
 */
export function formatDuration(openTimestamp: number, closeTimestamp: number): string {
  const ms = getDurationMs(openTimestamp, closeTimestamp);
  if (ms < 0) return '0m';

  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (minutes % 60 > 0 || parts.length === 0) parts.push(`${minutes % 60}m`);

  return parts.join(' ');
}

/**
 * R-Multiple: PNL ÷ (risk per trade)
 * Risk = |openPrice - stopLoss| × quantity (if stopLoss present)
 */
export function calculateRMultiple(
  pnl: number,
  openPrice: number,
  stopLoss: number | undefined,
  quantity: number
): number | null {
  if (stopLoss === undefined || stopLoss === 0) return null;
  const risk = Math.abs(openPrice - stopLoss) * quantity;
  if (risk === 0) return null;
  return pnl / risk;
}
