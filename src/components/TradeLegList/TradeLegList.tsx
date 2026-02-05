/**
 * TradeLegList Component
 * 
 * Displays a list of trade legs (buy or sell) with consistent formatting.
 * Used in both BUY and SELL columns of the TradeCard.
 */

import React from 'react';
import { TradeLeg } from '../../store/types';
import { formatCurrency } from '../../utils/calculations';

interface TradeLegListProps {
  legs: TradeLeg[];
  type: 'BUY' | 'SELL';
}

export const TradeLegList: React.FC<TradeLegListProps> = ({ legs, type }) => {
  const bgColor = type === 'BUY' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'BUY' ? 'border-green-200' : 'border-red-200';
  const textColor = type === 'BUY' ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`${bgColor} ${borderColor} border-2 rounded-lg p-4 h-full`}>
      <h3 className={`font-bold text-lg mb-4 ${textColor}`}>
        {type}
      </h3>
      
      {legs.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No {type.toLowerCase()} legs yet</p>
      ) : (
        <div className="space-y-3">
          {legs.map((leg) => (
            <div 
              key={leg.id} 
              className="bg-white rounded p-3 shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-900">
                  ${formatCurrency(leg.price)}
                </span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  Qty: {leg.quantity}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {new Date(leg.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
