/**
 * TradeListPage
 * Main page: trades table, filters, search, market data.
 * Syncs API + localStorage via hooks.
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTrades } from '../hooks/useTrades';
import { useMarketData } from '../hooks/useMarketData';
import { TradeTable } from './TradeTable';
import { TradeFilters } from './TradeFilters';
import { TradeDetailModal } from './modals/TradeDetailModal';
import { CreateTradeModal } from './modals/CreateTradeModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { filterTrades, sortTradesByOpenTimestamp } from '../utils/tradeFilters';
import { tradeStorageService } from '../services/tradeStorageService';
import { loadFilters, saveFilters } from '../utils/filterStorage';
import { CONFIRM_MODAL_VARIANT, type Trade, type TradeFilters as TradeFiltersType } from './constants/types';
import { mockTrades } from '../data/mockTrades';

const DEMO_LOADED_KEY = 'trade_journal_demo_loaded';

function getDemoLoaded(): boolean {
  return localStorage.getItem(DEMO_LOADED_KEY) === 'true';
}

const defaultFilters: TradeFiltersType = {
  symbol: '',
  position: '',
  status: '',
  entryType: '',
  tags: [],
  searchNotes: '',
};

export const TradeListPage: React.FC = () => {
  const { trades, addTrade, updateTrade, deleteTrade, loadTrades } = useTrades();
  const [wsReconnectTrigger, setWsReconnectTrigger] = useState(0);

  const symbols = useMemo(
    () => tradeStorageService.getUniqueSymbols(trades),
    [trades]
  );

  const { data: marketData,  error } = useMarketData(symbols, wsReconnectTrigger);

  const [filters, setFilters] = useState<TradeFiltersType>(() => {
    const loaded = loadFilters();
    return loaded ? { ...defaultFilters, ...loaded } : defaultFilters;
  });

  const handleFiltersChange = useCallback((f: TradeFiltersType) => {
    setFilters(f);
    saveFilters(f);
  }, []);
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const [selectedTradeIds, setSelectedTradeIds] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoadDemoConfirm, setShowLoadDemoConfirm] = useState(false);
  const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(getDemoLoaded);
  const [loadDemoHighlighted, setLoadDemoHighlighted] = useState(false);

  useEffect(() => {
    if (!getDemoLoaded()) {
      setLoadDemoHighlighted(true);
      const timer = setTimeout(() => setLoadDemoHighlighted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const filteredTrades = useMemo(() => {
    const filtered = filterTrades(trades, filters);
    return sortTradesByOpenTimestamp(filtered, true);
  }, [trades, filters]);

  const selectedTrade = useMemo(
    () => (selectedTradeId ? trades.find((t) => t.id === selectedTradeId) ?? null : null),
    [trades, selectedTradeId]
  );

  const existingTags = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => (t.tags || []).forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [trades]);

  const handleRowClick = useCallback((trade: Trade) => {
    setSelectedTradeId(trade.id);
  }, []);

  const handleToggleTrade = useCallback((tradeId: string) => {
    setSelectedTradeIds((prev) =>
      prev.includes(tradeId) ? prev.filter((id) => id !== tradeId) : [...prev, tradeId]
    );
  }, []);

  const handleSelectAllChange = useCallback((selected: boolean) => {
    setSelectedTradeIds(selected ? filteredTrades.map((t) => t.id) : []);
  }, [filteredTrades]);

  const handleEditSelected = useCallback(() => {
    if (selectedTradeIds.length === 1) {
      setSelectedTradeId(selectedTradeIds[0]);
    }
  }, [selectedTradeIds]);

  const handleDeleteSelectedClick = useCallback(() => {
    setShowDeleteSelectedConfirm(true);
  }, []);

  const handleConfirmDeleteSelected = useCallback(() => {
    selectedTradeIds.forEach((id) => deleteTrade(id));
    setSelectedTradeIds([]);
    setShowDeleteSelectedConfirm(false);
  }, [selectedTradeIds, deleteTrade]);

  const handleCreateTrade = useCallback(
    (trade: Trade) => {
      addTrade(trade);
      localStorage.setItem(DEMO_LOADED_KEY, 'true');
      setDemoLoaded(true);
      setShowCreateForm(false);
      setWsReconnectTrigger((k) => k + 1);
      setFilters(defaultFilters);
      saveFilters(defaultFilters);
      requestAnimationFrame(() => {
        loadTrades();
      });
    },
    [addTrade, loadTrades]
  );

  const handleLoadDemoConfirm = useCallback(() => {
    const currentTrades = tradeStorageService.getAll();
    const newTrades = mockTrades.map((t, i) => ({ ...t, id: `trade-${Date.now()}-${i}` }));
    const allTrades = [...currentTrades, ...newTrades];
    tradeStorageService.save(allTrades);
    localStorage.setItem(DEMO_LOADED_KEY, 'true');
    setDemoLoaded(true);
    setShowLoadDemoConfirm(false);
    loadTrades();
  }, [loadTrades]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Trade Journal</h1>
              <p className="text-blue-100 text-sm mt-1">
                Trades with live market data
              </p>
            </div>
            <div className="flex gap-3">
              {!demoLoaded && (
                <button
                  onClick={() => setShowLoadDemoConfirm(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    loadDemoHighlighted
                      ? 'bg-blue-400 ring-2 ring-white ring-offset-2 ring-offset-blue-700 shadow-lg shadow-black/20'
                      : 'bg-blue-500 hover:bg-blue-400'
                  }`}
                >
                  Try sample list
                </button>
              )}
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium shadow"
              >
                Create New Trade
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            {error} (using mock data)
          </div>
        )}

        <TradeFilters
          trades={trades}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {filteredTrades.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl text-gray-400 mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No trades yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create a trade or try the sample list to get started.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Create Trade
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white shadow overflow-hidden">
            <div className="flex min-h-[2.75rem] items-center justify-between border-b border-gray-200 bg-gray-50/80 px-4 py-2">
              <h2 className="text-sm font-semibold text-gray-700">Trade Journal Store</h2>
              {selectedTradeIds.length > 0 && (
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleEditSelected}
                    disabled={selectedTradeIds.length !== 1}
                    className="rounded border border-violet-400 bg-transparent px-2 py-0.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSelectedClick}
                    className="bg-transparent px-0 py-0.5 text-xs font-medium text-rose-500 transition-colors hover:text-rose-600 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                  <span className="text-xs text-gray-500">
                    {selectedTradeIds.length} selected
                  </span>
                </div>
              )}
            </div>
            <TradeTable
              trades={filteredTrades}
              marketData={marketData}
              selectedTradeIds={selectedTradeIds}
              onToggleTrade={handleToggleTrade}
              onSelectAllChange={handleSelectAllChange}
              onRowClick={handleRowClick}
            />
          </div>
        )}
      </main>

      {selectedTrade && (
        <TradeDetailModal
          key={selectedTrade.id}
          trade={selectedTrade}
          onClose={() => {
            setSelectedTradeId(null);
            setSelectedTradeIds([]);
          }}
          onUpdate={updateTrade}
        />
      )}

      {showCreateForm && (
        <CreateTradeModal
          onSubmit={handleCreateTrade}
          onCancel={() => setShowCreateForm(false)}
          existingTags={existingTags}
        />
      )}

      <ConfirmModal
        isOpen={showLoadDemoConfirm}
        title="Try sample list?"
        message="This will add sample trades to your journal so you can explore the app. You can delete them anytime."
        confirmLabel="Add sample list"
        cancelLabel="Cancel"
        onConfirm={handleLoadDemoConfirm}
        onCancel={() => setShowLoadDemoConfirm(false)}
      />

      <ConfirmModal
        isOpen={showDeleteSelectedConfirm}
        title="Delete trade(s)?"
        message={
          selectedTradeIds.length === 1
            ? 'Are you sure you want to delete this trade? This cannot be undone.'
            : `Are you sure you want to delete ${selectedTradeIds.length} selected trades? This cannot be undone.`
        }
        variant={CONFIRM_MODAL_VARIANT.DANGER}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteSelected}
        onCancel={() => setShowDeleteSelectedConfirm(false)}
      />
    </div>
  );
};
