/**
 * TradeFilters Component
 * Filter by symbol, position, status, entry (Buy/Sell), tags, search notes.
 * Tags in dropdown with multi-select.
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
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
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);

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

  const selectAllTags = () => {
    onFiltersChange({ ...filters, tags: [] });
    setTagsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tagsRef.current && !tagsRef.current.contains(e.target as Node)) {
        setTagsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tagsLabel =
    filters.tags.length === 0
      ? 'All tags'
      : filters.tags.length === 1
        ? filters.tags[0]
        : `${filters.tags.length} tags selected`;

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
          className="border border-gray-300 rounded px-3 py-2 text-sm min-w-[100px]"
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
          className="border border-gray-300 rounded px-3 py-2 text-sm min-w-[100px]"
        >
          <option value="">All</option>
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>
      </div>

      {/* Status filter (Open / Closed) */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Open/Closed
        </label>
        <select
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value as 'OPEN' | 'CLOSED' | '',
            })
          }
          className="border border-gray-300 rounded px-3 py-2 text-sm min-w-[100px]"
        >
          <option value="">All</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Entry (Buy/Sell) filter */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Entry (Buy/Sell)
        </label>
        <select
          value={filters.entryType}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              entryType: e.target.value as 'BUY' | 'SELL' | '',
            })
          }
          className="border border-gray-300 rounded px-3 py-2 text-sm min-w-[100px]"
        >
          <option value="">All</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>
      </div>

      {/* Tags dropdown with multi-select */}
      <div ref={tagsRef} className="relative">
        <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
        <button
          type="button"
          onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
          className="flex items-center justify-between min-w-[160px] border border-gray-300 rounded px-3 py-2 text-sm bg-white hover:bg-gray-50 text-left"
        >
          <span>{tagsLabel}</span>
          <span className="text-gray-400 ml-2">▾</span>
        </button>
        {tagsDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-2 max-h-48 overflow-y-auto min-w-[200px]">
            <button
              type="button"
              onClick={selectAllTags}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                filters.tags.length === 0 ? 'bg-blue-50 text-blue-700 font-medium' : ''
              }`}
            >
              All tags
            </button>
            {allTags.length > 0 && (
              <div className="border-t border-gray-100 mt-1 pt-1">
                {allTags.map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="rounded border-gray-300"
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search notes */}
      <div className="min-w-[200px] flex-1">
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
