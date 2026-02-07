/**
 * TradeDetailModal Component
 * Shows trade summary, entry/exit markers, and price chart on row click.
 * Editable notes and tags (bonus).
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { Trade, Position, TradeStatus } from '../constants/types';
import {
  calculatePnL,
  formatDuration,
  calculateRMultiple,
  toDateTimeLocalGMT,
  fromDateTimeLocalGMT,
} from '../../utils/calculations';

interface TradeDetailModalProps {
  trade: Trade | null;
  onClose: () => void;
  onUpdate?: (id: string, updates: Partial<Trade>) => void;
}

function getOpenLegLabel(position: Position): string {
  return position === 'LONG' ? 'Buy' : 'Sell';
}
function getCloseLegLabel(position: Position): string {
  return position === 'LONG' ? 'Sell' : 'Buy';
}

/**
 * Generate mock price series for chart (entry to exit with open/close markers)
 */
function buildChartData(trade: Trade) {
  const points: { time: string; price: number; label?: string }[] = [];
  const start = trade.openTimestamp;
  const end = trade.closeTimestamp ?? Date.now();
  const closePrice = trade.closePrice ?? trade.openPrice;
  const steps = 20;

  for (let i = 0; i <= steps; i++) {
    const t = start + (i / steps) * (end - start);
    const progress = i / steps;
    const price = trade.openPrice + (closePrice - trade.openPrice) * progress;
    points.push({
      time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' GMT',
      price,
      label: i === 0 ? 'Entry' : i === steps ? 'Exit' : undefined,
    });
  }

  return points;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({
  trade,
  onClose,
  onUpdate,
}) => {
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [editStatus, setEditStatus] = useState<TradeStatus>('OPEN');
  const [editClosePrice, setEditClosePrice] = useState('');
  const [editCloseTimestamp, setEditCloseTimestamp] = useState<number>(Date.now());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!trade) return;
    setEditNotes(trade.notes ?? '');
    setEditTags(trade.tags ?? []);
    setEditStatus(trade.status);
    setEditClosePrice(trade.closePrice != null ? String(trade.closePrice) : '');
    setEditCloseTimestamp(trade.closeTimestamp ?? Date.now());
    setIsEditing(false);
  }, [trade]);

  const chartData = useMemo(() => (trade ? buildChartData(trade) : []), [trade]);

  if (!trade) return null;

  const isClosed = trade.status === 'CLOSED' && trade.closePrice != null;
  const pnl = isClosed
    ? calculatePnL(trade.position, trade.openPrice, trade.closePrice!, trade.quantity)
    : null;
  const duration = isClosed && trade.closeTimestamp != null
    ? formatDuration(trade.openTimestamp, trade.closeTimestamp)
    : null;
  const rMultiple = pnl != null
    ? calculateRMultiple(pnl, trade.openPrice, trade.stopLoss, trade.quantity)
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-5 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              {trade.symbol} {trade.position}
            </h2>
            <span
              className={`inline-block px-2.5 py-1 text-xs font-semibold rounded ${
                trade.status === 'OPEN'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {trade.status}
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <div className="create-trade-form-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 space-y-6">
          {/* Trade summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Open ({getOpenLegLabel(trade.position)}) ($)</div>
              <div className="font-semibold">{trade.openPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Close ({getCloseLegLabel(trade.position)}) ($)</div>
              <div className="font-semibold">
                {trade.closePrice != null ? trade.closePrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Quantity</div>
              <div className="font-semibold">{trade.quantity}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Duration</div>
              <div className="font-semibold">{duration ?? '—'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-lg p-4 bg-green-50">
              <div className="text-sm text-gray-500">PNL ($)</div>
              <div
                className={`font-bold text-xl ${
                  pnl != null
                    ? pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {pnl != null
                  ? `${pnl >= 0 ? '+' : '-'}${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  : '—'}
              </div>
            </div>
            {rMultiple != null && (
              <div className="rounded-lg p-4 bg-blue-50">
                <div className="text-sm text-gray-500">R-Multiple</div>
                <div className="font-bold text-xl text-blue-700">
                  {rMultiple.toFixed(2)}R
                </div>
              </div>
            )}
            {trade.stopLoss != null && (
              <div className="rounded-lg p-4 bg-gray-50">
                <div className="text-sm text-gray-500">Stop Loss ($)</div>
                <div className="font-semibold">{trade.stopLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
            )}
          </div>

          {/* Price chart with entry/exit markers */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Price Movement</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => v.toLocaleString()}
                  />
                  <Tooltip
                    formatter={(v: number) => Number(v).toLocaleString()}
                    labelFormatter={(label) => `Time (GMT): ${label}`}
                  />
                  <ReferenceLine
                    y={trade.openPrice}
                    stroke="#22c55e"
                    strokeDasharray="4 4"
                    label={{ value: 'Entry', position: 'right' }}
                  />
                  {trade.closePrice != null && (
                    <ReferenceLine
                      y={trade.closePrice}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      label={{ value: 'Exit', position: 'right' }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 bg-white px-5 py-3">
              <h3 className="text-base font-semibold text-gray-800">Notes & details</h3>
              {onUpdate && (
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      const updates: Partial<Trade> = {
                        notes: editNotes,
                        tags: editTags.length ? editTags : undefined,
                        status: editStatus,
                      };
                      if (editStatus === 'CLOSED') {
                        const closePriceNum = parseFloat(editClosePrice);
                        if (!Number.isNaN(closePriceNum)) updates.closePrice = closePriceNum;
                        updates.closeTimestamp = editCloseTimestamp;
                      } else {
                        updates.closePrice = undefined;
                        updates.closeTimestamp = undefined;
                      }
                      onUpdate(trade.id, updates);
                    }
                    setIsEditing(!isEditing);
                  }}
                  className={
                    isEditing
                      ? 'rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700'
                      : 'rounded-lg border border-violet-400 bg-transparent px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50'
                  }
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="p-5 space-y-5">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-2">Status</span>
                  <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setEditStatus('OPEN')}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        editStatus === 'OPEN'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditStatus('CLOSED');
                        if (editStatus === 'OPEN') setEditCloseTimestamp(Date.now());
                      }}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        editStatus === 'CLOSED'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Closed
                    </button>
                  </div>
                </div>
                {editStatus === 'CLOSED' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Close price ($)</label>
                      <input
                        type="number"
                        step="any"
                        min={0}
                        value={editClosePrice}
                        onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault(); }}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v !== '' && parseFloat(v) < 0) return;
                          setEditClosePrice(v);
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Close time (GMT)</label>
                      <input
                        type="datetime-local"
                        value={toDateTimeLocalGMT(editCloseTimestamp)}
                        onChange={(e) => setEditCloseTimestamp(fromDateTimeLocalGMT(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    placeholder="Add notes…"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        setEditTags((t) => [...t, tagInput.trim()]);
                        setTagInput('');
                      }
                    }}
                    placeholder="Type a tag and press Enter"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-2"
                  />
                  {editTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setEditTags((t) => t.filter((x) => x !== tag))}
                            className="rounded-full p-0.5 text-blue-600 hover:bg-blue-200 hover:text-blue-900"
                            aria-label={`Remove ${tag}`}
                          >
                            <span className="sr-only">Remove</span>
                            <span aria-hidden>&times;</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {trade.notes || 'No notes.'}
                </p>
                {(trade.tags?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {trade.tags!.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
