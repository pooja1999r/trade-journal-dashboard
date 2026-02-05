/**
 * TradeForm Component
 * 
 * Form for creating new trades with multiple buy and sell legs.
 * Includes validation and clean UX for adding legs dynamically.
 */

import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addTrade } from '../../store/tradeSlice';
import { Trade, TradeLeg, TradeDirection } from '../../store/types';

interface LegInput {
  price: string;
  quantity: string;
  timestamp: string;
}

export const TradeForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  // Trade-level state
  const [symbol, setSymbol] = useState('');
  const [direction, setDirection] = useState<TradeDirection>('LONG');
  const [notes, setNotes] = useState('');

  // Buy and Sell legs state
  const [buyLegs, setBuyLegs] = useState<LegInput[]>([]);
  const [sellLegs, setSellLegs] = useState<LegInput[]>([]);

  // Current leg being added
  const [currentBuyLeg, setCurrentBuyLeg] = useState<LegInput>({
    price: '',
    quantity: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const [currentSellLeg, setCurrentSellLeg] = useState<LegInput>({
    price: '',
    quantity: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const addBuyLeg = () => {
    if (currentBuyLeg.price && currentBuyLeg.quantity) {
      setBuyLegs([...buyLegs, currentBuyLeg]);
      setCurrentBuyLeg({
        price: '',
        quantity: '',
        timestamp: new Date().toISOString().slice(0, 16),
      });
    }
  };

  const addSellLeg = () => {
    if (currentSellLeg.price && currentSellLeg.quantity) {
      setSellLegs([...sellLegs, currentSellLeg]);
      setCurrentSellLeg({
        price: '',
        quantity: '',
        timestamp: new Date().toISOString().slice(0, 16),
      });
    }
  };

  const removeBuyLeg = (index: number) => {
    setBuyLegs(buyLegs.filter((_, i) => i !== index));
  };

  const removeSellLeg = (index: number) => {
    setSellLegs(sellLegs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol.trim()) {
      alert('Please enter a symbol');
      return;
    }

    if (buyLegs.length === 0 && sellLegs.length === 0) {
      alert('Please add at least one buy or sell leg');
      return;
    }

    // Convert string inputs to proper types
    const convertedBuyLegs: TradeLeg[] = buyLegs.map((leg, idx) => ({
      id: `buy-${Date.now()}-${idx}`,
      price: parseFloat(leg.price),
      quantity: parseFloat(leg.quantity),
      timestamp: new Date(leg.timestamp).toISOString(),
    }));

    const convertedSellLegs: TradeLeg[] = sellLegs.map((leg, idx) => ({
      id: `sell-${Date.now()}-${idx}`,
      price: parseFloat(leg.price),
      quantity: parseFloat(leg.quantity),
      timestamp: new Date(leg.timestamp).toISOString(),
    }));

    // Determine trade status based on legs
    const status = convertedSellLegs.length > 0 ? 'CLOSED' : 'OPEN';

    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      symbol: symbol.trim().toUpperCase(),
      direction,
      status,
      buyLegs: convertedBuyLegs,
      sellLegs: convertedSellLegs,
      createdAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    dispatch(addTrade(newTrade));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Create New Trade</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Trade Information */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symbol *
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g., AAPL, BTCUSDT, NIFTY"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Direction *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="LONG"
                    checked={direction === 'LONG'}
                    onChange={(e) => setDirection(e.target.value as TradeDirection)}
                    className="mr-2"
                  />
                  <span className="text-green-700 font-semibold">LONG</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="SHORT"
                    checked={direction === 'SHORT'}
                    onChange={(e) => setDirection(e.target.value as TradeDirection)}
                    className="mr-2"
                  />
                  <span className="text-red-700 font-semibold">SHORT</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this trade..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Two-column layout for Buy and Sell legs */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Buy Legs */}
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-4">Buy Legs</h3>

              {/* Added Buy Legs */}
              {buyLegs.length > 0 && (
                <div className="mb-4 space-y-2">
                  {buyLegs.map((leg, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border border-green-200 flex justify-between items-center">
                      <div className="text-sm">
                        <div className="font-semibold">${leg.price} × {leg.quantity}</div>
                        <div className="text-gray-600 text-xs">
                          {new Date(leg.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBuyLeg(idx)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Buy Leg */}
              <div className="space-y-2">
                <input
                  type="number"
                  step="0.01"
                  value={currentBuyLeg.price}
                  onChange={(e) => setCurrentBuyLeg({ ...currentBuyLeg, price: e.target.value })}
                  placeholder="Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  step="0.01"
                  value={currentBuyLeg.quantity}
                  onChange={(e) => setCurrentBuyLeg({ ...currentBuyLeg, quantity: e.target.value })}
                  placeholder="Quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="datetime-local"
                  value={currentBuyLeg.timestamp}
                  onChange={(e) => setCurrentBuyLeg({ ...currentBuyLeg, timestamp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={addBuyLeg}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium"
                >
                  + Add Buy Leg
                </button>
              </div>
            </div>

            {/* Sell Legs */}
            <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-4">Sell Legs</h3>

              {/* Added Sell Legs */}
              {sellLegs.length > 0 && (
                <div className="mb-4 space-y-2">
                  {sellLegs.map((leg, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border border-red-200 flex justify-between items-center">
                      <div className="text-sm">
                        <div className="font-semibold">${leg.price} × {leg.quantity}</div>
                        <div className="text-gray-600 text-xs">
                          {new Date(leg.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSellLeg(idx)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Sell Leg */}
              <div className="space-y-2">
                <input
                  type="number"
                  step="0.01"
                  value={currentSellLeg.price}
                  onChange={(e) => setCurrentSellLeg({ ...currentSellLeg, price: e.target.value })}
                  placeholder="Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  step="0.01"
                  value={currentSellLeg.quantity}
                  onChange={(e) => setCurrentSellLeg({ ...currentSellLeg, quantity: e.target.value })}
                  placeholder="Quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="datetime-local"
                  value={currentSellLeg.timestamp}
                  onChange={(e) => setCurrentSellLeg({ ...currentSellLeg, timestamp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={addSellLeg}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-medium"
                >
                  + Add Sell Leg
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
