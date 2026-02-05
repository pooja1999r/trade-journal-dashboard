/**
 * TradeTable Component
 * Renders trades in a table with all required columns.
 * Sorted by openTimestamp (latest first).
 */

import React from 'react';
import type { Trade, MarketDataMap, Position } from '../../types';
import {
  calculatePnL,
  formatDuration,
  calculateRMultiple,
} from '../../utils/calculations';

interface TradeTableProps {
  trades: Trade[];
  marketData: MarketDataMap;
  onRowClick: (trade: Trade) => void;
}

function formatPrice(n: number): string {
  return n >= 1 ? n.toLocaleString(undefined, { minimumFractionDigits: 2 }) : n.toFixed(6);
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

/** Open leg: LONG = Buy, SHORT = Sell */
function getOpenLegLabel(position: Position): string {
  return position === 'LONG' ? 'Buy' : 'Sell';
}
/** Close leg: LONG = Sell, SHORT = Buy */
function getCloseLegLabel(position: Position): string {
  return position === 'LONG' ? 'Sell' : 'Buy';
}

export const TradeTable: React.FC<TradeTableProps> = ({
  trades,
  marketData,
  onRowClick,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Symbol
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Position
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Open Time
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Open (Buy/Sell)
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Close Time
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Close (Sell/Buy)
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Duration
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              Open Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              Close Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              PNL
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              R-Value
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              Stop Loss
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Tags
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Notes
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              Current Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              Daily %
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trades.map((trade) => {
            const pnl = trade.status === 'CLOSED' && trade.closePrice != null
              ? calculatePnL(trade.position, trade.openPrice, trade.closePrice, trade.quantity)
              : null;
            const duration = trade.status === 'CLOSED' && trade.closeTimestamp != null
              ? formatDuration(trade.openTimestamp, trade.closeTimestamp)
              : '—';
            const rMultiple = pnl != null
              ? calculateRMultiple(pnl, trade.openPrice, trade.stopLoss, trade.quantity)
              : null;
            const md = marketData[trade.symbol.toUpperCase()];

            return (
              <tr
                key={trade.id}
                onClick={() => onRowClick(trade)}
                className="hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {trade.symbol}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                      trade.status === 'OPEN'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {trade.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                      trade.position === 'LONG'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {trade.position}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatTimestamp(trade.openTimestamp)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={trade.position === 'LONG' ? 'text-green-700' : 'text-red-700'}>
                    {getOpenLegLabel(trade.position)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {trade.closeTimestamp != null ? formatTimestamp(trade.closeTimestamp) : '—'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {trade.status === 'CLOSED' ? (
                    <span className={trade.position === 'LONG' ? 'text-red-700' : 'text-green-700'}>
                      {getCloseLegLabel(trade.position)}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{duration}</td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {formatPrice(trade.openPrice)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {trade.closePrice != null ? formatPrice(trade.closePrice) : '—'}
                </td>
                <td
                  className={`px-4 py-3 text-sm text-right font-semibold ${
                    pnl != null
                      ? pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {pnl != null ? `${pnl >= 0 ? '+' : ''}${formatPrice(pnl)}` : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  {rMultiple != null ? rMultiple.toFixed(2) + 'R' : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {trade.stopLoss != null ? formatPrice(trade.stopLoss) : '—'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {trade.tags?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {trade.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                  {trade.notes || '—'}
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {md ? formatPrice(parseFloat(md.last)) : '—'}
                </td>
                <td
                  className={`px-4 py-3 text-sm text-right ${
                    md && parseFloat(md.daily_change_percentage) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {md
                    ? parseFloat(md.daily_change_percentage).toFixed(2) + '%'
                    : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
