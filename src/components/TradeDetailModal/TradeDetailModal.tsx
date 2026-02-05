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
import type { Trade, Position } from '../../types';
import {
  calculatePnL,
  formatDuration,
  calculateRMultiple,
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
      time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditNotes(trade?.notes ?? '');
    setEditTags(trade?.tags ?? []);
    setIsEditing(false);
  }, [trade?.id]);

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

  const chartData = useMemo(() => buildChartData(trade), [trade]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {trade.symbol} {trade.position}
            </h2>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded ${
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
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Trade summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Open ({getOpenLegLabel(trade.position)})</div>
              <div className="font-semibold">{trade.openPrice.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Close ({getCloseLegLabel(trade.position)})</div>
              <div className="font-semibold">
                {trade.closePrice != null ? trade.closePrice.toLocaleString() : '—'}
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
              <div className="text-sm text-gray-500">PNL</div>
              <div
                className={`font-bold text-xl ${
                  pnl != null
                    ? pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {pnl != null
                  ? `${pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
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
                <div className="text-sm text-gray-500">Stop Loss</div>
                <div className="font-semibold">{trade.stopLoss.toLocaleString()}</div>
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
                    formatter={(v: number) => v.toLocaleString()}
                    labelFormatter={(label) => `Time: ${label}`}
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Notes</h3>
              {onUpdate && (
                <button
                  onClick={() => {
                    if (isEditing) {
                      onUpdate(trade.id, { notes: editNotes, tags: editTags.length ? editTags : undefined });
                    }
                    setIsEditing(!isEditing);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Tags (add and press Enter)</label>
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
                    placeholder="Type tag and press Enter"
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                  />
                  <div className="flex flex-wrap gap-2">
                    {editTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => setEditTags((t) => t.filter((x) => x !== tag))}
                          className="text-blue-600 hover:text-red-600"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-700 p-4 bg-gray-50 rounded-lg">
                  {trade.notes || '—'}
                </p>
                {(trade.tags?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {trade.tags!.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
