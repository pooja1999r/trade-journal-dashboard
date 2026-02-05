/**
 * CreateTradeForm Component
 * Form for creating new trades with the new schema.
 */

import React, { useState } from 'react';
import type { Trade } from '../../types';

interface CreateTradeFormProps {
  onSubmit: (trade: Trade) => void;
  onCancel: () => void;
}

export const CreateTradeForm: React.FC<CreateTradeFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const now = Date.now();
  const [symbol, setSymbol] = useState('BTC');
  const [position, setPosition] = useState<'LONG' | 'SHORT'>('LONG');
  const [openTimestamp, setOpenTimestamp] = useState(now - 24 * 60 * 60 * 1000);
  const [closeTimestamp, setCloseTimestamp] = useState(now);
  const [openPrice, setOpenPrice] = useState('');
  const [closePrice, setClosePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const op = parseFloat(openPrice);
    const cp = parseFloat(closePrice);
    const qty = parseFloat(quantity);

    if (isNaN(op) || isNaN(cp) || isNaN(qty) || op <= 0 || cp <= 0 || qty <= 0) {
      alert('Please enter valid open price, close price, and quantity');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const trade: Trade = {
      id: `trade-${Date.now()}`,
      symbol: symbol.toUpperCase(),
      position,
      openTimestamp,
      closeTimestamp,
      openPrice: op,
      closePrice: cp,
      quantity: qty,
      notes: notes.trim() || undefined,
      tags: tags.length ? tags : undefined,
    };

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">New Trade</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symbol *
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as 'LONG' | 'SHORT')}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                Close Time *
              </label>
              <input
                type="datetime-local"
                value={toDateLocal(closeTimestamp)}
                onChange={(e) => setCloseTimestamp(fromDateLocal(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
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
                Close Price *
              </label>
              <input
                type="number"
                step="any"
                value={closePrice}
                onChange={(e) => setClosePrice(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="swing, breakout"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Create Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
