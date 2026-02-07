/**
 * TradeFilters Component
 * Filter by symbol, position, status, entry (Buy/Sell), tags, search notes.
 * Uses shared SelectBox from ui-components.
 */

import React, { useMemo } from 'react';
import type { Trade, TradeFilters as TradeFiltersType } from './constants/types';
import { POSITION_OPTIONS, STATUS_OPTIONS, ENTRY_TYPE_OPTIONS } from './constants/filterOptions';
import { SelectBox } from './ui-components/SelectBox';

interface TradeFiltersProps {
  trades: Trade[];
  filters: TradeFiltersType;
  onFiltersChange: (f: TradeFiltersType) => void;
}

const labelBase = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500';

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

  return (
    <div className="sticky top-0 z-30 mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end gap-5">
        <SelectBox
          mode="single"
          label="Symbol"
          options={uniqueSymbols}
          value={filters.symbol || null}
          onChange={(v) => onFiltersChange({ ...filters, symbol: v ?? '' })}
          placeholder="All"
          allowClear
          clearLabel="All"
          minWidth="120px"
        />

        <SelectBox
          mode="single"
          label="Position"
          options={POSITION_OPTIONS}
          value={filters.position || null}
          onChange={(v) => onFiltersChange({ ...filters, position: (v ?? '') as '' | 'LONG' | 'SHORT' })}
          placeholder="All"
          allowClear
          clearLabel="All"
          minWidth="120px"
        />

        <SelectBox
          mode="single"
          label="Open/Closed"
          options={STATUS_OPTIONS}
          value={filters.status || null}
          onChange={(v) => onFiltersChange({ ...filters, status: (v ?? '') as '' | 'OPEN' | 'CLOSED' })}
          placeholder="All"
          allowClear
          clearLabel="All"
          minWidth="120px"
        />

        <SelectBox
          mode="single"
          label="Entry (Buy/Sell)"
          options={ENTRY_TYPE_OPTIONS}
          value={filters.entryType || null}
          onChange={(v) => onFiltersChange({ ...filters, entryType: (v ?? '') as '' | 'BUY' | 'SELL' })}
          placeholder="All"
          allowClear
          clearLabel="All"
          minWidth="120px"
        />

        <SelectBox
          mode="multi"
          label="Tags"
          options={allTags}
          value={filters.tags}
          onChange={(tags) => onFiltersChange({ ...filters, tags })}
          placeholder="All tags"
          selectAllLabel="All tags"
          minWidth="180px"
          dropdownMinWidth="180px"
        />

        <div className="min-w-[200px] flex-1">
          <label htmlFor="filter-search" className={labelBase}>
            Search notes
          </label>
          <input
            id="filter-search"
            type="text"
            value={filters.searchNotes}
            onChange={(e) =>
              onFiltersChange({ ...filters, searchNotes: e.target.value })
            }
            placeholder="Search in notes..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>
    </div>
  );
};
