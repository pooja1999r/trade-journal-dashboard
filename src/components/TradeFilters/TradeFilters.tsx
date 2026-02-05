/**
 * TradeFilters Component
 * Filter by symbol, position, tags. Search by notes.
 * Client-side, performant filtering.
 */

import React, { useMemo } from 'react';
import type { Trade, TradeFilters as TradeFiltersType } from '../../types';

interface TradeFiltersProps {
  trades: Trade[];
  filters: TradeFiltersType;
  onFiltersChange: (f: TradeFiltersType) => void;
}

export const TradeFilters: React.FC<TradeFiltersProps> = ({
  trades,
  filters,
  onFiltersChange,
}) => {
  const uniqueSymbols = useMemo(() => {
    const set = new Set(trades.map((t) => t.symbol.toUpperCase()));
    return Array.from(set).sort();
  }, [trades]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => (t.tags || []).forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [trades]);

  const toggleTag = (tag: string) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: next });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-lg border border-gray-200 mb-4">
      {/* Symbol filter */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Symbol
        </label>
        <select
          value={filters.symbol}
          onChange={(e) => onFiltersChange({ ...filters, symbol: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {uniqueSymbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Position filter */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Position
        </label>
        <select
          value={filters.position}
          onChange={(e) =>
            onFiltersChange({ ...filters, position: e.target.value as 'LONG' | 'SHORT' | '' })
          }
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>
      </div>

      {/* Status filter (Open / Closed) */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value as 'OPEN' | 'CLOSED' | '',
            })
          }
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Tags multi-select */}
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filters.tags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Search notes */}
      <div className="min-w-[200px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Search notes
        </label>
        <input
          type="text"
          value={filters.searchNotes}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchNotes: e.target.value })
          }
          placeholder="Search in notes..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};
