/**
 * TradeFilters Component
 * Filter by symbol, position, status, entry (Buy/Sell), tags, search notes.
 * All dropdowns share the same custom UI (button + panel).
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { Trade, TradeFilters as TradeFiltersType, DropdownKey } from './constants/types';

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
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const dropdownsRef = useRef<HTMLDivElement>(null);

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
    setOpenDropdown(null);
  };

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownsRef.current && !dropdownsRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownButton = (key: DropdownKey) =>
    `flex w-full min-w-[120px] items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-left text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
      openDropdown === key
        ? 'border-blue-500 ring-2 ring-blue-500/20'
        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
    }`;

  const dropdownPanel =
    'absolute left-0 right-0 top-full z-[100] mt-1.5 max-h-52 min-w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-lg ring-1 ring-black/5';

  const optionClass = (isSelected: boolean) =>
    `w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
      isSelected ? 'bg-blue-50 font-semibold text-blue-700' : 'text-gray-700'
    }`;

  const tagsLabel =
    filters.tags.length === 0
      ? 'All tags'
      : filters.tags.length === 1
        ? filters.tags[0]
        : `${filters.tags.length} tags selected`;

  const labelBase = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500';

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg
      className={`ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div ref={dropdownsRef} className="sticky top-0 mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end gap-5">
        {/* Symbol filter */}
        <div className="relative w-full min-w-[120px] sm:w-auto">
          <span className={labelBase}>Symbol</span>
          <button
            type="button"
            onClick={() => toggleDropdown('symbol')}
            className={dropdownButton('symbol')}
          >
            <span className="truncate">{filters.symbol || 'All'}</span>
            <ChevronIcon open={openDropdown === 'symbol'} />
          </button>
          {openDropdown === 'symbol' && (
            <div className={dropdownPanel}>
              <button
                type="button"
                onClick={() => {
                  onFiltersChange({ ...filters, symbol: '' });
                  setOpenDropdown(null);
                }}
                className={optionClass(!filters.symbol)}
              >
                All
              </button>
              {uniqueSymbols.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onFiltersChange({ ...filters, symbol: s });
                    setOpenDropdown(null);
                  }}
                  className={optionClass(filters.symbol === s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Position filter */}
        <div className="relative w-full min-w-[120px] sm:w-auto">
          <span className={labelBase}>Position</span>
          <button
            type="button"
            onClick={() => toggleDropdown('position')}
            className={dropdownButton('position')}
          >
            <span className="truncate">{filters.position || 'All'}</span>
            <ChevronIcon open={openDropdown === 'position'} />
          </button>
          {openDropdown === 'position' && (
            <div className={dropdownPanel}>
              {(['', 'LONG', 'SHORT'] as const).map((val) => (
                <button
                  key={val || 'all'}
                  type="button"
                  onClick={() => {
                    onFiltersChange({ ...filters, position: val });
                    setOpenDropdown(null);
                  }}
                  className={optionClass(filters.position === val)}
                >
                  {val || 'All'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status filter (Open / Closed) */}
        <div className="relative w-full min-w-[120px] sm:w-auto">
          <span className={labelBase}>Open/Closed</span>
          <button
            type="button"
            onClick={() => toggleDropdown('status')}
            className={dropdownButton('status')}
          >
            <span className="truncate">
              {filters.status ? (filters.status === 'OPEN' ? 'Open' : 'Closed') : 'All'}
            </span>
            <ChevronIcon open={openDropdown === 'status'} />
          </button>
          {openDropdown === 'status' && (
            <div className={dropdownPanel}>
              {(
                [
                  ['', 'All'],
                  ['OPEN', 'Open'],
                  ['CLOSED', 'Closed'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val || 'all'}
                  type="button"
                  onClick={() => {
                    onFiltersChange({ ...filters, status: val });
                    setOpenDropdown(null);
                  }}
                  className={optionClass(filters.status === val)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Entry (Buy/Sell) filter */}
        <div className="relative w-full min-w-[120px] sm:w-auto">
          <span className={labelBase}>Entry (Buy/Sell)</span>
          <button
            type="button"
            onClick={() => toggleDropdown('entry')}
            className={dropdownButton('entry')}
          >
            <span className="truncate">
              {filters.entryType ? (filters.entryType === 'BUY' ? 'Buy' : 'Sell') : 'All'}
            </span>
            <ChevronIcon open={openDropdown === 'entry'} />
          </button>
          {openDropdown === 'entry' && (
            <div className={dropdownPanel}>
              {(
                [
                  ['', 'All'],
                  ['BUY', 'Buy'],
                  ['SELL', 'Sell'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val || 'all'}
                  type="button"
                  onClick={() => {
                    onFiltersChange({ ...filters, entryType: val });
                    setOpenDropdown(null);
                  }}
                  className={optionClass(filters.entryType === val)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags dropdown with multi-select */}
        <div className="relative w-full min-w-[180px] sm:w-auto">
          <span className={labelBase}>Tags</span>
          <button
            type="button"
            onClick={() => toggleDropdown('tags')}
            className={`flex w-full min-w-[180px] items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-left text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              openDropdown === 'tags'
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <span className="truncate">{tagsLabel}</span>
            <ChevronIcon open={openDropdown === 'tags'} />
          </button>
          {openDropdown === 'tags' && (
            <div className="absolute left-0 right-0 top-full z-[100] mt-1.5 max-h-52 min-w-[220px] overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-lg ring-1 ring-black/5">
              <button
                type="button"
                onClick={selectAllTags}
                className={optionClass(filters.tags.length === 0)}
              >
                All tags
              </button>
              {allTags.length > 0 && (
                <div className="border-t border-gray-100 pt-1">
                  {allTags.map((tag) => (
                    <label
                      key={tag}
                      className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={filters.tags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
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
