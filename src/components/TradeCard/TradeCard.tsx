/**
 * TradeCard Component
 * 
 * Main component displaying a trade in the three-column layout:
 * BUY | TRADE | SELL
 * 
 * This is the core visualization component for the Trade Journal.
 */

import React from 'react';
import { Trade } from '../../store/types';
import { TradeLegList } from '../TradeLegList/TradeLegList';
import { 
  calculateTotalQuantity, 
  calculateAveragePrice, 
  calculatePnL,
  formatCurrency 
} from '../../utils/calculations';
import { useAppDispatch } from '../../store/hooks';
import { closeTrade, deleteTrade } from '../../store/tradeSlice';

interface TradeCardProps {
  trade: Trade;
}

export const TradeCard: React.FC<TradeCardProps> = ({ trade }) => {
  const dispatch = useAppDispatch();

  const totalBuyQty = calculateTotalQuantity(trade.buyLegs);
  const totalSellQty = calculateTotalQuantity(trade.sellLegs);
  const avgBuyPrice = calculateAveragePrice(trade.buyLegs);
  const avgSellPrice = calculateAveragePrice(trade.sellLegs);
  const pnl = calculatePnL(trade);

  const handleCloseTrade = () => {
    if (window.confirm('Are you sure you want to close this trade?')) {
      dispatch(closeTrade(trade.id));
    }
  };

  const handleDeleteTrade = () => {
    if (window.confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
      dispatch(deleteTrade(trade.id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200 hover:shadow-xl transition-shadow">
      {/* Three-column layout: BUY | TRADE | SELL */}
      <div className="grid grid-cols-3 gap-6">
        {/* BUY COLUMN */}
        <div className="flex flex-col">
          <TradeLegList legs={trade.buyLegs} type="BUY" />
        </div>

        {/* TRADE COLUMN (CENTER) */}
        <div className="flex flex-col justify-between bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-900">{trade.symbol}</h2>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  trade.status === 'OPEN' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {trade.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Direction:</span>
                <span className={`font-semibold ${
                  trade.direction === 'LONG' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {trade.direction}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {new Date(trade.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="border-t border-gray-300 my-3"></div>

              <div className="flex justify-between">
                <span className="text-gray-600">Buy Qty:</span>
                <span className="font-semibold text-green-700">{totalBuyQty}</span>
              </div>

              {avgBuyPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Buy:</span>
                  <span className="font-semibold text-green-700">
                    ${formatCurrency(avgBuyPrice)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Sell Qty:</span>
                <span className="font-semibold text-red-700">{totalSellQty}</span>
              </div>

              {avgSellPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Sell:</span>
                  <span className="font-semibold text-red-700">
                    ${formatCurrency(avgSellPrice)}
                  </span>
                </div>
              )}

              {trade.status === 'CLOSED' && (
                <>
                  <div className="border-t border-gray-300 my-3"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-bold">P&L:</span>
                    <span className={`font-bold text-lg ${
                      pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pnl >= 0 ? '+' : ''}${formatCurrency(pnl)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {trade.notes && (
              <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Notes: </span>
                  {trade.notes}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-2">
            {trade.status === 'OPEN' && (
              <button
                onClick={handleCloseTrade}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close Trade
              </button>
            )}
            <button
              onClick={handleDeleteTrade}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete Trade
            </button>
          </div>
        </div>

        {/* SELL COLUMN */}
        <div className="flex flex-col">
          <TradeLegList legs={trade.sellLegs} type="SELL" />
        </div>
      </div>
    </div>
  );
};
