/**
 * TradeList Page
 * 
 * Main page displaying all trades with filtering options.
 * Shows trades in a clean, scannable layout.
 */

import React, { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { TradeCard } from '../components/TradeCard/TradeCard';
import { TradeStatus } from '../store/types';

export const TradeList: React.FC = () => {
  const trades = useAppSelector((state) => state.trades.trades);
  const [filter, setFilter] = useState<'ALL' | TradeStatus>('ALL');

  // Filter trades based on selected filter
  const filteredTrades = filter === 'ALL' 
    ? trades 
    : trades.filter(trade => trade.status === filter);

  // Sort trades by creation date (newest first)
  const sortedTrades = [...filteredTrades].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const openCount = trades.filter(t => t.status === 'OPEN').length;
  const closedCount = trades.filter(t => t.status === 'CLOSED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Stats and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-8">
            <div>
              <div className="text-sm text-gray-600">Total Trades</div>
              <div className="text-2xl font-bold text-gray-900">{trades.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Open Trades</div>
              <div className="text-2xl font-bold text-blue-600">{openCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Closed Trades</div>
              <div className="text-2xl font-bold text-gray-600">{closedCount}</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('OPEN')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'OPEN'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilter('CLOSED')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'CLOSED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Closed
            </button>
          </div>
        </div>
      </div>

      {/* Trade Cards */}
      {sortedTrades.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No trades yet
          </h3>
          <p className="text-gray-500">
            {filter === 'ALL' 
              ? 'Create your first trade to get started' 
              : `No ${filter.toLowerCase()} trades found`}
          </p>
        </div>
      ) : (
        <div>
          {sortedTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))}
        </div>
      )}
    </div>
  );
};
