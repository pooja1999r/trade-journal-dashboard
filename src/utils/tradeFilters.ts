/**
 * Client-side trade filtering utilities
 * Performant filter logic separate from UI
 */

import { ENTRY_TYPE, POSITION, type Trade, type TradeFilters } from '../components/constants/types';

export function filterTrades(trades: Trade[], filters: TradeFilters): Trade[] {
  return trades.filter((trade) => {
    if (filters.symbol && trade.symbol.toUpperCase() !== filters.symbol.toUpperCase()) {
      return false;
    }
    if (filters.position && trade.position !== filters.position) {
      return false;
    }
    if (filters.status && trade.status !== filters.status) {
      return false;
    }
    if (filters.entryType && (filters.entryType === ENTRY_TYPE.BUY ? trade.position !== POSITION.LONG : trade.position !== POSITION.SHORT)) {
      return false;
    }
    if (filters.tags.length > 0) {
      const tradeTags = trade.tags || [];
      const hasAll = filters.tags.every((tag) =>
        tradeTags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
      if (!hasAll) return false;
    }
    if (filters.searchNotes.trim()) {
      const query = filters.searchNotes.toLowerCase();
      const notes = (trade.notes || '').toLowerCase();
      if (!notes.includes(query)) return false;
    }
    return true;
  });
}

export function sortTradesByOpenTimestamp(trades: Trade[], latestFirst = true): Trade[] {
  return [...trades].sort((a, b) =>
    latestFirst ? b.openTimestamp - a.openTimestamp : a.openTimestamp - b.openTimestamp
  );
}
