/**
 * TradeTable Component
 * Renders trades in a table with all required columns.
 * First column: checkbox for selection. Row click opens detail modal.
 */

import React, { useRef, useEffect } from 'react';
import type { Trade, MarketDataMap, Position } from './constants/types';
import {
  calculatePnL,
  formatDuration,
  calculateRMultiple,
} from '../utils/calculations';

interface TradeTableProps {
  trades: Trade[];
  marketData: MarketDataMap;
  selectedTradeIds: string[];
  onToggleTrade: (tradeId: string) => void;
  onSelectAllChange?: (selected: boolean) => void;
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
  selectedTradeIds,
  onToggleTrade,
  onSelectAllChange,
  onRowClick,
}) => {
  const allVisibleSelected =
    trades.length > 0 && trades.every((t) => selectedTradeIds.includes(t.id));
  const someVisibleSelected =
    trades.length > 0 && trades.some((t) => selectedTradeIds.includes(t.id));
  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected;
  }, [someVisibleSelected, allVisibleSelected]);

  return (
    <div
      className="trade-table-scroll relative z-0 overflow-x-auto overflow-y-visible"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#d1d5db #f9fafb',
      }}
    >
      <table className="min-w-full divide-y divide-gray-200" style={{ tableLayout: 'auto' }}>
        <thead className="bg-gray-50">
          <tr>
            <th
              className="sticky left-0 z-20 w-10 min-w-[2.5rem] bg-slate-100 px-3 py-3 text-center shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
              style={{ position: 'sticky', left: 0 }}
            >
              {onSelectAllChange ? (
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(e) => onSelectAllChange(e.target.checked)}
                  className="h-4 w-4 rounded border border-gray-400 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  aria-label="Select all rows"
                />
              ) : (
                <span className="sr-only">Select</span>
              )}
            </th>
            <th
              className="sticky left-0 z-20 min-w-[100px] bg-slate-100 px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
              style={{ left: '2.5rem' }}
            >
              Symbol
            </th>
            <th
              className="sticky z-20 min-w-[84px] bg-slate-100 px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
              style={{ left: 'calc(2.5rem + 100px)' }}
            >
              Status
            </th>
            <th
              className="sticky z-20 min-w-[84px] bg-slate-100 px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
              style={{ left: 'calc(2.5rem + 184px)' }}
            >
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
              Quantity
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
                className="cursor-pointer transition-colors hover:bg-blue-50"
              >
                <td
                  className="sticky left-0 z-10 w-10 min-w-[2.5rem] bg-slate-50 px-3 py-3 text-center align-middle shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] transition-colors hover:bg-slate-100"
                  style={{ position: 'sticky', left: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedTradeIds.includes(trade.id)}
                    onChange={() => onToggleTrade(trade.id)}
                    className="h-4 w-4 rounded border border-gray-400 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    aria-label={`Select ${trade.symbol}`}
                  />
                </td>
                <td
                  className="sticky left-0 z-10 min-w-[100px] bg-slate-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] transition-colors group-hover:bg-slate-100"
                  style={{ left: '2.5rem' }}
                >
                  {trade.symbol}
                </td>
                <td
                  className="sticky z-10 min-w-[84px] bg-slate-50 px-4 py-3 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] transition-colors group-hover:bg-slate-100"
                  style={{ left: 'calc(2.5rem + 100px)' }}
                >
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
                <td
                  className="sticky z-10 min-w-[84px] bg-slate-50 px-4 py-3 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] transition-colors group-hover:bg-slate-100"
                  style={{ left: 'calc(2.5rem + 184px)' }}
                >
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
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {formatPrice(trade.quantity)}
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
                    trade.tags.length === 1 ? (
                      <span className="inline-block max-w-[100px] truncate px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {trade.tags[0]}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block max-w-[100px] truncate px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium" title={trade.tags[0]}>
                          {trade.tags[0]}
                        </span>
                        <span className="text-xs font-medium text-violet-600">
                          +{trade.tags.length - 1} more
                        </span>
                      </span>
                    )
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
