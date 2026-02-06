/**
 * TradeListPage
 * Main page: trades table, filters, search, market data.
 * Syncs API + localStorage via hooks.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useTrades } from '../hooks/useTrades';
import { useMarketData } from '../hooks/useMarketData';
import { TradeTable } from '../components/TradeTable/TradeTable';
import { TradeFilters } from '../components/TradeFilters/TradeFilters';
import { TradeDetailModal } from '../components/TradeDetailModal/TradeDetailModal';
import { CreateTradeForm } from '../components/CreateTradeForm/CreateTradeForm';
import { filterTrades, sortTradesByOpenTimestamp } from '../utils/tradeFilters';
import { tradeStorageService } from '../services/tradeStorageService';
import { loadFilters, saveFilters } from '../utils/filterStorage';
import type { Trade, TradeFilters as TradeFiltersType } from '../types';
import { mockTrades } from '../data/mockTrades';

const defaultFilters: TradeFiltersType = {
  symbol: '',
  position: '',
  status: '',
  entryType: '',
  tags: [],
  searchNotes: '',
};

export const TradeListPage: React.FC = () => {
  const { trades, addTrade, updateTrade, loadTrades } = useTrades();

  const symbols = useMemo(
    () => tradeStorageService.getUniqueSymbols(trades),
    [trades]
  );

  const { data: marketData, isLoading, error } = useMarketData(symbols);

  const [filters, setFilters] = useState<TradeFiltersType>(() => {
    const loaded = loadFilters();
    return loaded ? { ...defaultFilters, ...loaded } : defaultFilters;
  });

  const handleFiltersChange = useCallback((f: TradeFiltersType) => {
    setFilters(f);
    saveFilters(f);
  }, []);
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const handleCreateTrade = useCallback(
    (trade: Trade) => {
      addTrade(trade);
      setShowCreateForm(false);
      loadTrades();
    },
    [addTrade, loadTrades]
  );

  const handleLoadMockData = useCallback(() => {
    if (window.confirm('Load demo trades? This will add to existing trades.')) {
      mockTrades.forEach((t, i) =>
        addTrade({ ...t, id: `trade-${Date.now()}-${i}` })
      );
    }
  }, [addTrade]);

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
              <button
                onClick={handleLoadMockData}
                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg font-medium"
              >
                Load Demo
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium shadow"
              >
                + New Trade
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

        {isLoading && symbols.length > 0 && (
          <div className="mb-4 text-sm text-gray-500">
            Loading market data...
          </div>
        )}

        {filteredTrades.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl text-gray-400 mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No trades yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create a trade or load demo data to get started.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Create Trade
            </button>
          </div>
        ) : (
          <TradeTable
            trades={filteredTrades}
            marketData={marketData}
            onRowClick={handleRowClick}
          />
        )}
      </main>

      {selectedTrade && (
        <TradeDetailModal
          key={selectedTrade.id}
          trade={selectedTrade}
          onClose={() => setSelectedTradeId(null)}
          onUpdate={updateTrade}
        />
      )}

      {showCreateForm && (
        <CreateTradeForm
          onSubmit={handleCreateTrade}
          onCancel={() => setShowCreateForm(false)}
          existingTags={existingTags}
        />
      )}
    </div>
  );
};
