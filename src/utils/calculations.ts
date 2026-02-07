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

/** Format timestamp as date/time string in GMT (UTC) */
export function formatTimestampGMT(ts: number): string {
  return new Date(ts).toLocaleString(undefined, { timeZone: 'UTC' }) + ' GMT';
}

/** Format timestamp for datetime-local input value, in GMT (YYYY-MM-DDTHH:mm) */
export function toDateTimeLocalGMT(ts: number): string {
  const d = new Date(ts);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const h = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
}

/** Parse datetime-local string as GMT and return timestamp */
export function fromDateTimeLocalGMT(s: string): number {
  const [datePart, timePart] = s.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [h, min] = (timePart || '00:00').split(':').map(Number);
  return Date.UTC(y, m - 1, d, h, min, 0, 0);
}
