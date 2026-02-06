/**
 * CreateTradeModal Component
 * Modal form for creating new trades with the new schema.
 * Symbol selector loads from localStorage.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Trade, TradeStatus } from '../constants/types';
import { useCoins } from '../../hooks/useCoins';

interface CreateTradeModalProps {
  onSubmit: (trade: Trade) => void;
  onCancel: () => void;
  existingTags?: string[];
}

const DISPLAY_LIMIT = 80;

export const CreateTradeModal: React.FC<CreateTradeModalProps> = ({
  onSubmit,
  onCancel,
  existingTags = [],
}) => {
  const now = Date.now();
  const { coins, isLoading, error } = useCoins();
  const [symbol, setSymbol] = useState('ETHBTC');
  const [symbolDropdownOpen, setSymbolDropdownOpen] = useState(false);
  const symbolRef = useRef<HTMLDivElement>(null);

  const filteredCoins = useMemo(() => coins.slice(0, DISPLAY_LIMIT), [coins]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (symbolRef.current && !symbolRef.current.contains(target)) {
        setSymbolDropdownOpen(false);
      }
      if (tagsRef.current && !tagsRef.current.contains(target)) {
        setTagsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [position, setPosition] = useState<'LONG' | 'SHORT'>('LONG');
  const [status, setStatus] = useState<TradeStatus>('CLOSED');
  const [openTimestamp, setOpenTimestamp] = useState(now - 24 * 60 * 60 * 1000);
  const [closeTimestamp, setCloseTimestamp] = useState(now);
  const [openPrice, setOpenPrice] = useState('');
  const [closePrice, setClosePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const addTagFromInput = () => {
    const trimmed = tagsInput.trim();
    if (trimmed && !selectedTags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedTags((prev) => [...prev, trimmed]);
      setTagsInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const op = parseFloat(openPrice);
    const cp = closePrice.trim() ? parseFloat(closePrice) : NaN;
    const qty = parseFloat(quantity);

    if (isNaN(op) || isNaN(qty) || op <= 0 || qty <= 0) {
      setValidationError('Please enter valid open price and quantity');
      return;
    }
    if (status === 'CLOSED' && (isNaN(cp) || cp <= 0)) {
      setValidationError('Please enter valid close price for closed trades');
      return;
    }

    const trade: Trade = {
      id: `trade-${Date.now()}`,
      symbol: symbol.toUpperCase(),
      position,
      status,
      openTimestamp,
      openPrice: op,
      quantity: qty,
      notes: notes.trim() || undefined,
      tags: selectedTags.length ? selectedTags : undefined,
    };

    if (status === 'CLOSED') {
      trade.closeTimestamp = closeTimestamp;
      trade.closePrice = cp;
    }

    if (stopLoss.trim()) {
      const sl = parseFloat(stopLoss);
      if (!isNaN(sl)) trade.stopLoss = sl;
    }

    onSubmit(trade);
  };

  const toDateLocal = (ts: number) => {
    const d = new Date(ts);
    return d.toISOString().slice(0, 16);
  };

  const fromDateLocal = (s: string) => new Date(s).getTime();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
          <h2 className="text-2xl font-bold text-gray-900">New Trade</h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="create-trade-form-scroll flex flex-1 flex-col overflow-y-auto px-8 py-6"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f9fafb',
          }}
        >
          <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div ref={symbolRef} className="relative sm:col-span-2">
            <span
              role="button"
              tabIndex={0}
              onClick={() => setSymbolDropdownOpen((o) => !o)}
              onKeyDown={(e) => e.key === 'Enter' && setSymbolDropdownOpen((o) => !o)}
              className="mb-1.5 block cursor-pointer text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Symbol *
            </span>
            <button
              type="button"
              onClick={() => setSymbolDropdownOpen((o) => !o)}
              disabled={isLoading}
              className={`flex w-full min-w-[120px] items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-left text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-wait ${
                symbolDropdownOpen
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">
                {isLoading ? 'Loading...' : (symbol || 'Select symbol')}
              </span>
              <svg
                className={`ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${symbolDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {symbolDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-[100] mt-1.5 max-h-52 min-w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-lg ring-1 ring-black/5">
                {isLoading && (
                  <p className="px-4 py-3 text-sm text-gray-500">Loading symbols...</p>
                )}
                {error && (
                  <p className="px-4 py-2 text-sm text-red-600">{error}</p>
                )}
                {!error && !isLoading && filteredCoins.length === 0 && (
                  <p className="px-4 py-3 text-sm text-gray-500">No symbols found</p>
                )}
                {!error && !isLoading &&
                  filteredCoins.map((coin) => (
                    <button
                      key={coin.id}
                      type="button"
                      onClick={() => {
                        setSymbol(coin.symbol.toUpperCase());
                        setSymbolDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                        symbol.toUpperCase() === coin.symbol.toUpperCase()
                          ? 'bg-blue-50 font-semibold text-blue-700'
                          : 'text-gray-700'
                      }`}
                    >
                      {coin.symbol.toUpperCase()}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Position *
            </label>
            <div className="flex gap-3">
              {(['LONG', 'SHORT'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPosition(opt)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold shadow-sm transition-all ${
                    position === opt
                      ? opt === 'LONG'
                        ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/20'
                        : 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {opt === 'LONG' ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  {opt}
                </button>
              ))}
            </div>
          </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status *
            </label>
            <div className="flex gap-3">
              {(['OPEN', 'CLOSED'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatus(opt)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold shadow-sm transition-all ${
                    status === opt
                      ? opt === 'OPEN'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-gray-500 bg-gray-100 text-gray-700 ring-2 ring-gray-500/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {opt === 'OPEN' ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {opt === 'OPEN' ? 'Open (holding)' : 'Closed (exited)'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Open Time *
              </label>
              <input
                type="datetime-local"
                value={toDateLocal(openTimestamp)}
                onChange={(e) => setOpenTimestamp(fromDateLocal(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Close Time {status === 'CLOSED' ? '*' : '(optional)'}
              </label>
              <input
                type="datetime-local"
                value={toDateLocal(closeTimestamp)}
                onChange={(e) => setCloseTimestamp(fromDateLocal(e.target.value))}
                disabled={status === 'OPEN'}
                className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Open Price *
              </label>
              <input
                type="number"
                step="any"
                value={openPrice}
                onChange={(e) => setOpenPrice(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Close Price {status === 'CLOSED' ? '*' : '(optional)'}
              </label>
              <input
                type="number"
                step="any"
                value={closePrice}
                onChange={(e) => setClosePrice(e.target.value)}
                disabled={status === 'OPEN'}
                className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                required={status === 'CLOSED'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stop Loss (optional)
            </label>
            <input
              type="number"
              step="any"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div ref={tagsRef} className="relative">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tags
            </label>
            <div
              className={`flex min-h-[42px] w-full flex-col rounded-lg border bg-white shadow-sm transition-colors ${
                tagsDropdownOpen
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                      className="rounded-full p-0.5 hover:bg-blue-200"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addTagFromInput();
                    }
                  }}
                  onFocus={() => setTagsDropdownOpen(true)}
                  placeholder="Type tag and press Enter..."
                  className="min-w-[140px] flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
                  className="flex-shrink-0 p-1"
                >
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${tagsDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {tagsDropdownOpen && (
                <div className="max-h-52 overflow-y-auto border-t border-gray-100 py-2">
                  {existingTags
                    .filter((t) => !selectedTags.includes(t))
                    .filter((t) => !tagsInput.trim() || t.toLowerCase().includes(tagsInput.trim().toLowerCase()))
                    .slice(0, 50)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTags((prev) => [...prev, tag])}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {tag}
                      </button>
                    ))}
                  {existingTags.length === 0 && (
                    <p className="px-4 py-3 text-sm text-gray-500">No tags yet. Create a trade with tags first.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          </div>

          {validationError && (
            <p className="text-sm text-red-600">{validationError}</p>
          )}
          <div className="flex gap-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Create Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
