/**
 * TradeTable Component
 * Renders trades in a table with all required columns.
 * First column: checkbox for selection. Row click opens detail modal.
 */

import React, { useRef, useEffect, useState } from 'react';
import type { Trade, MarketDataMap, Position } from './constants/types';
import {
  calculatePnL,
  formatDuration,
  calculateRMultiple,
  formatTimestampGMT,
} from '../utils/calculations';
import { TruncateWithTooltip } from './ui-components/TruncateWithTooltip';

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
  const [hoveredNotesTradeId, setHoveredNotesTradeId] = useState<string | null>(null);

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected;
  }, [someVisibleSelected, allVisibleSelected]);

  return (
    <div
      className="trade-table-scroll overflow-x-auto overflow-y-visible"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#d1d5db #f9fafb',
      }}
    >
      <table
        className="min-w-full divide-y divide-gray-200"
        style={{
          tableLayout: 'fixed',
          minWidth: '98rem',
          borderCollapse: 'separate',
          borderSpacing: 0,
        }}
      >
        <colgroup>
          <col style={{ width: '2.5rem' }} />
          <col style={{ width: '6rem' }} />
          <col style={{ width: '5rem' }} />
          <col style={{ width: '5rem' }} />
          <col style={{ width: '9rem' }} />
          <col style={{ width: '5rem' }} />
          <col style={{ width: '9rem' }} />
          <col style={{ width: '5rem' }} />
          <col style={{ width: '4.5rem' }} />
          <col style={{ width: '6rem' }} />
          <col style={{ width: '6rem' }} />
          <col style={{ width: '4rem' }} />
          <col style={{ width: '5.5rem' }} />
          <col style={{ width: '3.5rem' }} />
          <col style={{ width: '5.5rem' }} />
          <col style={{ width: '6rem' }} />
          <col style={{ width: '10rem' }} />
          <col style={{ width: '6rem' }} />
          <col style={{ width: '4.5rem' }} />
        </colgroup>
        <thead className="bg-gray-50">
          <tr>
            <th
              className="z-20 bg-slate-100 px-2 py-3 text-center text-xs font-semibold text-slate-700 uppercase shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
              style={{ position: 'sticky', left: 0, minWidth: '2.5rem', maxWidth: '2.5rem', boxSizing: 'border-box' }}
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
              className="z-20 bg-slate-100 px-3 py-3 text-left text-xs font-semibold text-slate-700 uppercase shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
              style={{ position: 'sticky', left: '2.5rem', minWidth: '6rem', maxWidth: '6rem', boxSizing: 'border-box' }}
            >
              Symbol
            </th>
            <th
              className="z-20 bg-slate-100 px-3 py-3 text-left text-xs font-semibold text-slate-700 uppercase shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
              style={{ position: 'sticky', left: '8.5rem', minWidth: '5rem', maxWidth: '5rem', boxSizing: 'border-box' }}
            >
              Status
            </th>
            <th
              className="z-20 bg-slate-100 px-3 py-3 text-left text-xs font-semibold text-slate-700 uppercase shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200"
              style={{ position: 'sticky', left: '13.5rem', minWidth: '5rem', maxWidth: '5rem', boxSizing: 'border-box' }}
            >
              Position
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Open Time
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Open (Buy/Sell)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Close Time
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Close (Sell/Buy)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Duration
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Open Price ($)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Close Price ($)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Quantity
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              PNL ($)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              R-Value
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Stop Loss ($)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Tags
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Notes
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Current Price ($)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
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
                className={`cursor-pointer transition-colors hover:bg-blue-50 ${hoveredNotesTradeId === trade.id ? 'relative z-[30]' : ''}`}
              >
                <td
                  className="z-10 bg-slate-50 px-2 py-3 text-center align-middle shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] transition-colors hover:bg-slate-100"
                  style={{ position: 'sticky', left: 0, minWidth: '2.5rem', maxWidth: '2.5rem', boxSizing: 'border-box' }}
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
                  className="z-10 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-gray-900 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] transition-colors group-hover:bg-slate-100 overflow-hidden"
                  style={{ position: 'sticky', left: '2.5rem', minWidth: '6rem', maxWidth: '6rem', boxSizing: 'border-box' }}
                >
                  <span className="block truncate" title={trade.symbol}>{trade.symbol}</span>
                </td>
                <td
                  className="z-10 bg-slate-50 px-3 py-3 text-left shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] transition-colors group-hover:bg-slate-100 overflow-hidden"
                  style={{ position: 'sticky', left: '8.5rem', minWidth: '5rem', maxWidth: '5rem', boxSizing: 'border-box' }}
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
                  className="z-10 bg-slate-50 px-3 py-3 text-left shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] transition-colors group-hover:bg-slate-100 overflow-hidden border-r border-gray-200"
                  style={{ position: 'sticky', left: '13.5rem', minWidth: '5rem', maxWidth: '5rem', boxSizing: 'border-box' }}
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
                <td className="px-3 py-3 text-left text-sm text-gray-600 overflow-hidden">
                  <span className="block truncate" title={formatTimestampGMT(trade.openTimestamp)}>
                    {formatTimestampGMT(trade.openTimestamp)}
                  </span>
                </td>
                <td className="px-3 py-3 text-left text-sm overflow-hidden">
                  <span className={trade.position === 'LONG' ? 'text-green-700' : 'text-red-700'}>
                    {getOpenLegLabel(trade.position)}
                  </span>
                </td>
                <td className="px-3 py-3 text-left text-sm text-gray-600 overflow-hidden">
                  <span className="block truncate" title={trade.closeTimestamp != null ? formatTimestampGMT(trade.closeTimestamp) : ''}>
                    {trade.closeTimestamp != null ? formatTimestampGMT(trade.closeTimestamp) : '—'}
                  </span>
                </td>
                <td className="px-3 py-3 text-left text-sm overflow-hidden">
                  {trade.status === 'CLOSED' ? (
                    <span className={trade.position === 'LONG' ? 'text-red-700' : 'text-green-700'}>
                      {getCloseLegLabel(trade.position)}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-3 py-3 text-left text-sm text-gray-600 overflow-hidden">{duration}</td>
                <td className="px-3 py-3 text-left text-sm font-mono overflow-hidden">
                  <span className="block truncate">{formatPrice(trade.openPrice)}</span>
                </td>
                <td className="px-3 py-3 text-left text-sm font-mono overflow-hidden">
                  <span className="block truncate">{trade.closePrice != null ? formatPrice(trade.closePrice) : '—'}</span>
                </td>
                <td className="px-3 py-3 text-left text-sm font-mono overflow-hidden">
                  <span className="block truncate">{formatPrice(trade.quantity)}</span>
                </td>
                <td
                  className={`px-3 py-3 text-left text-sm font-semibold overflow-hidden ${
                    pnl != null
                      ? pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  <span className="block truncate">{pnl != null ? `${pnl >= 0 ? '+' : '-'}${formatPrice(Math.abs(pnl))}` : '—'}</span>
                </td>
                <td className="px-3 py-3 text-left text-sm overflow-hidden">
                  <span className="block truncate">{rMultiple != null ? rMultiple.toFixed(2) + 'R' : '—'}</span>
                </td>
                <td className="px-3 py-3 text-left text-sm font-mono overflow-hidden">
                  <span className="block truncate">{trade.stopLoss != null ? formatPrice(trade.stopLoss) : '—'}</span>
                </td>
                <td className="px-3 py-3 text-left text-sm overflow-hidden">
                  {trade.tags?.length ? (
                    trade.tags.length === 1 ? (
                      <span className="inline-block truncate max-w-full px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium" title={trade.tags[0]}>
                        {trade.tags[0]}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <span className="inline-block truncate max-w-full px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium" title={trade.tags[0]}>
                          {trade.tags[0]}
                        </span>
                        <span className="text-xs font-medium text-violet-600 flex-shrink-0">
                          +{trade.tags.length - 1} more
                        </span>
                      </span>
                    )
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-3 py-3 text-left text-sm text-gray-600 overflow-visible max-w-[10rem]" style={{ maxWidth: '10rem' }}>
                  <TruncateWithTooltip
                    text={trade.notes ?? ''}
                    placeholder="—"
                    maxWidth="10rem"
                    placement="top"
                    onTooltipChange={(visible) => setHoveredNotesTradeId(visible ? trade.id : null)}
                  />
                </td>
                <td className="px-3 py-3 text-left text-sm font-mono overflow-hidden">
                  <span className="block truncate">{md ? formatPrice(parseFloat(md.last)) : '—'}</span>
                </td>
                <td
                  className={`px-3 py-3 text-left text-sm overflow-hidden ${
                    md && parseFloat(md.daily_change_percentage) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  <span className="block truncate">{md ? parseFloat(md.daily_change_percentage).toFixed(2) + '%' : '—'}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
