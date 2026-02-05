/**
 * Persist filters to localStorage
 */

import type { TradeFilters } from '../types';

const KEY = 'trade_journal_filters';

export function loadFilters(): TradeFilters | null {
  try {
    const s = localStorage.getItem(KEY);
    if (!s) return null;
    return JSON.parse(s) as TradeFilters;
  } catch {
    return null;
  }
}

export function saveFilters(filters: TradeFilters): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(filters));
  } catch (e) {
    console.error('Failed to save filters', e);
  }
}
